import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.split(' ')[1];
  const res = await fetch('http://localhost:5000/today-session', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return NextResponse.json(await res.json());
}