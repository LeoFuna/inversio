import { NextRequest, NextResponse } from "next/server";
import { getUrl } from "./lib/get-url";

export default function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token');
  const pathname = request.nextUrl.pathname;

  if (['/signin', '/signup'].includes(pathname) && token) {
    return NextResponse.redirect(new URL(getUrl('/')))
  }

  if (!['/signin', '/signup'].includes(pathname) && !token) {
    return NextResponse.redirect(new URL(getUrl('/signin')))
  }
}

export const config = {
  // para nao usar os assets ou apis do next
  matcher: ['/((?!api|_next/static|_next/image|flavicon.ico).*)']
}