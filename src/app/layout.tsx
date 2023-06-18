import { PropsWithChildren } from 'react'
import { Inter } from 'next/font/google'

import './globals.css'
import { Header } from '@/components/header'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'UNIR Conta Clara',
  description: 'Gerencie suas financas de um jeito descomplicado.',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html className={inter.variable} lang="pt-br">
      <body className="flex h-screen overflow-hidden items-center justify-center bg-neutral-950 font-sans text-neutral-200 flex-col">
        <div className="flex flex-col bg-neutral-900 rounded-lg max-w-5xl w-full h-[calc(100vh-10rem)]">
          <Header />
          <main className="flex flex-col flex-1 overflow-hidden px-6 py-2 border-t border-dashed border-neutral-800">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
