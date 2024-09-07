import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const origin = request.headers.get('origin') || '*';

  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  return response;
}

export const config = {
  matcher: '/model-editor/:path*',
};
