import { handleAction } from "@/app/api/example/handleAction";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  //
  const action = handleAction()
  return NextResponse.json({data: {name: "api", surname: "route", action}})
}

export async function POST(request: NextRequest) {
  return NextResponse.json({data: {name: "api", surname: "route"}})
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({data: {name: "api", surname: "route"}})
}
