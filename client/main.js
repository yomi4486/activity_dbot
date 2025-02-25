import { DiscordSDK } from "@discord/embedded-app-sdk";

import rocketLogo from './rocket.png';
import "./style.css";
let username="";

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

// Will eventually store the authenticated user's access_token
let auth;
const app = document.querySelector('#app')
async function appendVoiceChannelName() {
  // Update the UI with the name of the current voice channel
  const textTagString = username;
  document.getElementById("title").textContent = `Hello,${textTagString}`;
}

setupDiscordSdk().then(() => {
  appendVoiceChannelName();
});

async function setupDiscordSdk() {
  await discordSdk.ready();
  console.log("Discord SDK is ready");

  // Authorize with Discord Client
  const { code } = await discordSdk.commands.authorize({
    client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
    response_type: "code",
    state: "",
    prompt: "none",
    scope: [
      "identify",
      "guilds",
      "applications.commands",
      "guilds.members.read",
    ],
  });

  // Retrieve an access_token from your activity's server
  // Note: We need to prefix our backend `/api/token` route with `/.proxy` to stay compliant with the CSP.
  // Read more about constructing a full URL and using external resources at
  // https://discord.com/developers/docs/activities/development-guides#construct-a-full-url
  const response = await fetch(".proxy/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
    }),
  });
  const { access_token } = await response.json();

  // Authenticate with Discord client (using the access_token)
  auth = await discordSdk.commands.authenticate({
    access_token,
  });
  username = auth.user.username;
  
  if (auth == null) {
    throw new Error("Authenticate command failed");
  }
}

app.innerHTML = `
  <div>
    <img src="${rocketLogo}" class="logo" alt="Discord" />
    <h1 id="title">Hello</h1>
  </div>
`;