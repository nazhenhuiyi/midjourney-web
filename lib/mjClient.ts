import { Midjourney } from "midjourney";

export const getClient = async () => {
  const client = new Midjourney({
    ServerId: <string>process.env.SERVER_ID,
    ChannelId: <string>process.env.CHANNEL_ID,
    SalaiToken: <string>process.env.SALAI_TOKEN,
    Debug: true,
    Ws: process.env.WS === "true", //enable ws is required for remix mode (and custom zoom)
  });
  await client.init();
  return client;
};
