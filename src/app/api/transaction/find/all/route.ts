import { db } from '@/libs/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const listAllTransactions = await db.transaction.findMany({})

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
