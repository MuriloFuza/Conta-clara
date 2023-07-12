import { db } from '@/libs/prisma'
import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')

  try {
    await db.transaction.delete({
      where: {
        id: id?.toString(),
      },
    })

    return NextResponse.json(
      {
        data: {
          status: 'success',
          object: {
            transactionId: id,
            deleted: 'true',
          },
        },
      },
      { status: 200 },
    )
  } catch (err) {
    return NextResponse.json(
      {
        data: {
          status: 'error',
          error: err,
          object: {
            transactionId: id,
            deleted: 'false',
          },
        },
      },
      { status: 400 },
    )
  }
}
