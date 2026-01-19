import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  const res = await fetch('http://localhost:4000/exercises', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return NextResponse.json(await res.json());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = req.headers.get('authorization')?.split(' ')[1];
  const res = await fetch('http://localhost:4000/exercises', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body)
  });
  return NextResponse.json(await res.json());
}