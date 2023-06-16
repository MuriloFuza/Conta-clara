import { prisma } from '@/app/api/_base'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const month = request.nextUrl.searchParams.get('month')

    if (month) {
      const targetMonth = new Date()

      const startOfMonth = new Date(
        targetMonth.getFullYear(),
        parseInt(month) - 1,
        1,
      )
      const endOfMonth = new Date(
        targetMonth.getFullYear(),
        parseInt(month),
        0,
        0,
        0,
        0,
      )

      console.log(startOfMonth, endOfMonth)

      const listFiltered = await prisma.transaction.findMany({
        where: {
          transaction_date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      })
      console.log(listFiltered)

      return NextResponse.json({
        data: {
          status: 'success',
          object: listFiltered,
        },
      })
    }
  } catch (err) {
    console.log(err)
    return NextResponse.json({
      data: {
        status: 'error',
        error: err,
      },
    })
  }
}
