import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest, res: NextResponse) {
  const error = req.nextUrl.searchParams.get("error");
  if (error) {
    if (error === "Verification") {
      return NextResponse.redirect(
        `${req.nextUrl.origin}/login?error=Verification`
      );
    }
  }

  return NextResponse.next();
}
