import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
  }

  try {
    const filePath = join(process.cwd(), 'content', 'design', `${id}.md`);
    const content = await readFile(filePath, 'utf-8');
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }
}
