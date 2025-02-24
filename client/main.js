// SDK をインポート
import { DiscordSDK } from "@discord/embedded-app-sdk";

import "./style.css";
import rocketLogo from '/rocket.png';

// SDK のインスタンスを生成
const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

setupDiscordSdk().then(() => {
  console.log("Discord SDK is ready");
});

// SDK を介してアプリにアクセス
async function setupDiscordSdk() {
  await discordSdk.ready();
}

document.querySelector('#app').innerHTML = `
  <div>
    <img src="${rocketLogo}" class="logo" alt="Discord" />
    <h1>Hello, World!</h1>
  </div>
`;