"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

type MjResult =
  | {
      progress: string;
      uri: string;
    }
  | {
      progress: "done";
      content: string;
      uri: string;
    };
export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<MjResult | null>(null);
  const handleApply = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      // const res = await axios.post("/api/generate");
      const response = await fetch("/api/imagine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // This data is a ReadableStream
      const data = response.body;
      if (!data) {
        return;
      }

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        try {
          const chunkValue = decoder.decode(value);
          console.log(chunkValue);
          let resJson = JSON.parse(chunkValue);
          setResult(resJson);
          if (resJson.progress === "done") {
            break;
          }
        } catch (error) {
          console.log(error);
        }
      }
      // setResultImage(res.data.imageUrl);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const handleRetry = async () => {
    setResult(null);
    setPrompt("");
  };
  return (
    <>
      {!result ? (
        <main className="flex min-h-screen flex-col p-24">
          <Textarea
            value={prompt}
            placeholder="input your prompt to generate your image"
            onChange={(v) => setPrompt(v.target.value)}
          ></Textarea>
          <Button className="mt-4" disabled={isLoading} onClick={handleApply}>
            generate
          </Button>
        </main>
      ) : null}
      {result ? (
        <main className="flex min-h-screen flex-col p-24 items-center">
          <img src={result.uri} alt="" className="w-[500px]" />
          <div className="mt-4">
            <Button onClick={handleRetry}>retry</Button>
          </div>
        </main>
      ) : null}
    </>
  );
}
