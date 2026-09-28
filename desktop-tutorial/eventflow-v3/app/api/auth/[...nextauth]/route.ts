let handlers: any = { GET: undefined, POST: undefined };

try {
  const auth = await import('@/lib/auth');
  handlers = auth.handlers || { GET: undefined, POST: undefined };
} catch (error) {
  console.error('Failed to load auth handlers:', error);
}

export const GET = handlers?.GET || (async () => new Response('Auth not configured', { status: 500 }));
export const POST = handlers?.POST || (async () => new Response('Auth not configured', { status: 500 }));
