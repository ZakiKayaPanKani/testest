import { NextRequest, NextResponse } from "next/server";
import { getAcquisitionById } from "@/lib/queries";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const acq = await getAcquisitionById(id);

  if (!acq) {
    return NextResponse.json(
      { error: "Acquisition not found" },
      { status: 404 },
    );
  }

  const payload = {
    acquisitionId: acq.id,
    acquiredAt: acq.acquiredAt,
    priceJpy: acq.priceJpy,
    work: acq.workSnapshot,
    license: acq.licenseSnapshot,
    createdAt: acq.createdAt,
    _meta: {
      format: "artli-acquisition-receipt",
      version: "0.1.0",
      exportedAt: new Date().toISOString(),
    },
  };

  const json = JSON.stringify(payload, null, 2);

  return new NextResponse(json, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="artli-acquisition-${id}.json"`,
    },
  });
}
