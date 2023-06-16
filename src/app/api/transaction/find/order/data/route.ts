import { prisma } from '@/app/api/_base'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const listAllTransactions = await prisma.transaction.findMany({
      orderBy: {
        transaction_date: 'desc',
      },
    })

    return NextResponse.json({
      data: {
        status: 'success',
        listAllTransactions,
      },
    })
  } catch (err) {
    console.log(err)
    return NextResponse.json({
      data: { status: 'failed', error: err },
    })
  }
}
