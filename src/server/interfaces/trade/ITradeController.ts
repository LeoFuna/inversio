import { NextRequest, NextResponse } from "next/server";

export interface ITradeController {
  addTrade(req: NextRequest): Promise<NextResponse<{ id: string } | { message: string } | null>>;
}