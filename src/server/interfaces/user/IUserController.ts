import { NextRequest, NextResponse } from "next/server";

export interface IUserController {
  checkUserCredentials: (req: NextRequest) => Promise<NextResponse<{ email: string } | { message: string } | null>>;
}