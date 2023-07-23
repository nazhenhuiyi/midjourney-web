import { getClient } from "@/lib/mjClient";
import { NextRequest } from "next/server";
export const runtime = "edge";

export const POST = async (req: NextRequest) => {
  const client = await getClient();
  const { prompt } = await req.json();

  // const prompt =
  //   "Christmas dinner with spaghetti with family in a cozy house, we see interior details , simple blue&white illustration";
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller) {
      console.log("imagine.start", prompt);
      client
        .Imagine(prompt, (uri: string, progress: string) => {
          console.log("imagine.loading", uri);
          controller.enqueue(encoder.encode(JSON.stringify({ uri, progress })));
        })
        .then((msg) => {
          console.log("imagine.done", msg);
          controller.enqueue(encoder.encode(JSON.stringify(msg)));
          client.Close();
          controller.close();
        })
        .catch((err: any) => {
          console.log("imagine.error", err);
          client.Close();
          controller.close();
        });
    },
  });
  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Access-Control-Allow-Origin": "*",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
};
