/* eslint-disable camelcase */
import { db } from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { description, value, type, transaction_date } = await request.json()
  try {
    const transaction = await db.transaction.create({
      data: {
        description,
        value,
        type,
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
