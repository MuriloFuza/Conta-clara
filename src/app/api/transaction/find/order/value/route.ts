import { db } from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

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
    console.log(err)
    return NextResponse.json(
      {
        data: { status: 'failed', error: err },
      },
      { status: 400 },
    )
  }
}
