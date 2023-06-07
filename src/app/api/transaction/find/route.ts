import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  const { description, value, type } = await request.json()
  try {
    const transaction = await prisma.transaction.create({
      data: {
        description,
        value,
        type,
      },
    })

    return NextResponse.json({
      data: { status: 'created', object: transaction },
    })
  } catch (err) {
    console.log(err)
    return NextResponse.json({
      data: { status: 'failed', error: err },
    })
  }
}
