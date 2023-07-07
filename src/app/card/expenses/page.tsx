'use client'
import { useAuth } from '@clerk/nextjs'

export default function Expenses() {
  const { userId } = useAuth()

  return (
    <div className="space-y-4">
      <h1 className="capitalize font-bold text-xl">Fatura dos Cartões</h1>
    </div>
  )
}
