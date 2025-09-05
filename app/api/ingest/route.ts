import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        
        const response = await fetch(`${backendUrl}/api/ingest`, {
            method: "POST",
            body: formData, // Forward the FormData directly
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (err: unknown) {
        return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500});
    }
}