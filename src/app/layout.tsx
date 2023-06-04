import { PropsWithChildren } from 'react'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'UNIR Conta Clara',
  description: 'Gerencie suas financas de um jeito descomplicado.',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="pt-br">
      <body className={inter.variable}>
        <main className="flex bg-neutral-950 font-sans text-neutral-200 h-screen flex-col">
          {children}
        </main>
      </body>
    </html>
  )
}
