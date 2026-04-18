import { NextRequest, NextResponse } from "next/server";
import { acquireWork } from "@/lib/queries";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: workSlug } = await params;
  const body = await req.json();
  const userSlug = body.userSlug;

  if (!userSlug || typeof userSlug !== "string") {
    return NextResponse.json({ error: "userSlug required" }, { status: 400 });
  }

  const result = await acquireWork(userSlug, workSlug);

  if (!result.success) {
    const statusMap: Record<string, number> = {
      NOT_DEVELOPER: 403,
      WORK_NOT_FOUND: 404,
      NOT_PUBLIC: 403,
      NO_LICENSE: 400,
      CONSULT_REQUIRED: 403,
      ALREADY_ACQUIRED: 409,
    };
    return NextResponse.json(
      { error: result.error },
      { status: statusMap[result.error] ?? 400 },
    );
  }

  return NextResponse.json(
    { acquisitionId: result.acquisitionId },
    { status: 201 },
  );
}
