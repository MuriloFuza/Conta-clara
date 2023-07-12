import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
  XAxis,
} from 'recharts'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface MonthGraphInfo {
  day: Date
  credit?: number
  debit?: number
  card?: number
}

interface IGraphProps {
  monthData: MonthGraphInfo[]
}

export default function Graph({ monthData }: IGraphProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={monthData}>
        {/* @ts-ignore */}
        <XAxis
          dataKey="day"
          tickFormatter={(value) =>
            format(new Date(value), 'dd', { locale: ptBR })
          }
        />
        <YAxis tickFormatter={(value) => (value / 100) as unknown as string} />
        <Line type="monotone" dataKey="debit" stroke="#f87171" />
        <Line type="monotone" dataKey="credit" stroke="#4ade80" />
        <Line type="monotone" dataKey="card" stroke="#2c2cdb" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#171717',
          }}
          formatter={(value, name, props) => {
            return [
              Intl.NumberFormat('pt-br', {
                style: 'currency',
                currency: 'BRL',
              }).format(Number(value) / 100),
              name === 'debit'
                ? 'Débito'
                : name === 'credit'
                ? 'Crédito'
                : 'Cartão',
            ]
          }}
          labelFormatter={(label) => {
            return format(new Date(label), "dd 'de' LLLL", { locale: ptBR })
          }}
        />
        <Legend
          formatter={(label) => {
            return label === 'debit'
              ? 'Débito'
              : label === 'credit'
              ? 'Crédito'
              : 'Cartão'
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
