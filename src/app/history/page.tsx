import { MonthGraph } from '@/components/month-graph'

export default function History() {
  return (
    <div className="space-y-4">
      <h1 className="capitalize font-bold text-xl">Meu Gráfico Mensal</h1>
      <MonthGraph />
    </div>
  )
}
