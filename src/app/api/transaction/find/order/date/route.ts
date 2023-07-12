import { db } from '@/libs/prisma'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const listAllTransactions = await db.transaction.findMany({
      orderBy: {
        transaction_date: 'desc',
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
