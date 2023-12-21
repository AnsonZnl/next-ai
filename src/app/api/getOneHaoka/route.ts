import { NextResponse } from 'next/server';
import { haokaJson } from '@/config/haoka';
export async function GET() {
  return NextResponse.json({ hello: 'Next.js' });
}
