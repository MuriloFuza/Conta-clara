import { db } from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { name, limit, dueDate, userId } = await request.json()

  try {
    const cardExists = await db.card.findFirst({
      where: {
        name,
        userId,
      },
    })

    if (cardExists && cardExists.name === name) {
      throw new Error('card.AlreadyExists')
    }

    const day = new Date()
    let statusInvoice = ''

    if (dueDate >= day.getDate()) {
      statusInvoice = 'closed'
    } else {
      statusInvoice = 'open'
    }

    await db.card.create({
      data: {
        name,
        userId,
        dueDate,
        limit,
        statusInvoice,
      },
    })

    return NextResponse.json(
      {
        data: { status: 'created' },
      },
      { status: 201 },
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
