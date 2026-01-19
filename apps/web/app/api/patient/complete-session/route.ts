import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = req.headers.get('authorization')?.split(' ')[1];
  const res = await fetch('http://localhost:5000/complete-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body)
  });
  return NextResponse.json(await res.json());
}