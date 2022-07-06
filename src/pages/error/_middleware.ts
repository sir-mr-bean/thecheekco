import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest, res: NextResponse) {
  console.log("middleware");
  console.log(req.nextUrl);
  const error = req.nextUrl.searchParams.get("error");
  console.log(error);
  if (error) {
    console.log("error");
    if (error === "Verification") {
      console.log("Verification");
      return NextResponse.redirect(
        `${req.nextUrl.origin}/login?error=Verification`
      );
    }
  }

  return NextResponse.next();
}
