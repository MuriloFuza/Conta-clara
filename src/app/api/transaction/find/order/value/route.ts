import { db } from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  try {
    const listAllTransactions = await db.transaction.findMany({
      orderBy: {
        value: 'desc',
      },
    })

    return NextResponse.json(
      {
        data: {
          status: 'success',
          listAllTransactions,
        },
      },
      { status: 200 },
    )
  } catch (err) {
    return NextResponse.json(
      {
        data: { status: 'failed', error: err },
      },
      { status: 400 },
    )
  }
}
