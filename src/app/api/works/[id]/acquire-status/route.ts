import { NextRequest, NextResponse } from "next/server";
import { getAcquisitionStatus } from "@/lib/queries";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: workSlug } = await params;
  const userSlug = req.nextUrl.searchParams.get("userSlug");

  if (!userSlug) {
    return NextResponse.json(
      { isDeveloper: false, canAcquire: false, alreadyAcquired: false },
      { status: 200 },
    );
  }

  const status = await getAcquisitionStatus(userSlug, workSlug);
  return NextResponse.json(status);
}
