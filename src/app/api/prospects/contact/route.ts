import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const data = await req.json();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Unexpected error" }, { status: 500 });
  }
}
