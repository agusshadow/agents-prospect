import { NextResponse } from "next/server";

import { buildOpenApiSpec } from "@/lib/openapi";

export async function GET() {
  if (process.env["NODE_ENV"] === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }
  return NextResponse.json(buildOpenApiSpec());
}
