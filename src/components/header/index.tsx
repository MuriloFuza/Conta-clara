'use client'
import Link from 'next/link'
import { Home, Landmark, PieChart, CreditCard } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

export function Header() {
  const pathname = usePathname()

  const isAtHome = pathname === '/'
  const isAtHistory = pathname === '/history'
  const isAtCard = pathname === '/card'

  return (
    <div className="flex justify-between items-center p-3">
      <div className="flex gap-x-2">
        <Landmark size={28} />
        <h1 className="font-bold text-2xl">Conta Clara</h1>
        <UserButton afterSignOutUrl="/" />
      </div>
      <nav className="flex gap-x-2">
        <Link
          className={`p-2 border-y-2 border-transparent text-neutral-400 hover:text-neutral-200 ${
            isAtHome ? 'border-b-blue-500 text-neutral-50' : ''
          }`}
          href="/"
          title="Inicio"
        >
          <Home size={24} />
        </Link>
        <Link
          className={`p-2 border-y-2 border-transparent text-neutral-400 hover:text-neutral-200 ${
            isAtHistory ? 'border-b-blue-500 text-neutral-50' : ''
          }`}
          href="/history"
          title="Histórico"
        >
          <PieChart size={24} />
        </Link>
        <Link
          className={`p-2 border-y-2 border-transparent text-neutral-400 hover:text-neutral-200 ${
            isAtCard ? 'border-b-blue-500 text-neutral-50' : ''
          }`}
          href="/card"
          title="Crédito"
        >
          <CreditCard size={24} />
        </Link>
      </nav>
    </div>
  )
}
