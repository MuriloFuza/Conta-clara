import { db } from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // eslint-disable-next-line camelcase
  const { description, value, type, transaction_date, userId } =
    await request.json()
  try {
    const transaction = await db.transaction.create({
      data: {
        description,
        value,
        type,
        userId,
        // eslint-disable-next-line camelcase
        transaction_date,
      },
    })

    return NextResponse.json(
      {
        data: { status: 'created', object: transaction },
      },
      { status: 201 },
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
