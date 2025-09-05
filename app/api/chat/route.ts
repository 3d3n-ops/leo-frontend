import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, model, useRag, useWebSearch } = await req.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        message, 
        model, 
        use_rag: useRag || false,
        use_web_search: useWebSearch || false
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    // Handle streaming response
    if (response.body) {
      const reader = response.body.getReader();
      const stream = new ReadableStream({
        start(controller) {
          function pump(): Promise<void> {
            return reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              controller.enqueue(value);
              return pump();
            });
          }
          return pump();
        }
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
