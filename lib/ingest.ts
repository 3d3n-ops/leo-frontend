export async function ingestUrl(url: string) {
    const res = await fetch(`${process.env.BACKEND_URL}/ingest/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
      cache: "no-store",
    });
  
    return res.json();
  }
  