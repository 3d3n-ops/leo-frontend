export async function getAnswer(question: string) {
    const res = await fetch(`${process.env.BACKEND_URL}/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.BACKEND_API_KEY!,
      },
      body: JSON.stringify({ question }),
      cache: "no-store",
    });
  
    const data = await res.json();
    return data.answer;
  }
  