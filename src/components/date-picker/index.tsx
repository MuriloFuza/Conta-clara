import { FC } from 'react'
import { FieldError } from 'react-hook-form'
import DtPicker from 'react-tailwindcss-datepicker'
import { DateValueType } from 'react-tailwindcss-datepicker/dist/types'

interface IRangeDatePickerProps {
  name: string
  label: string
  error?: FieldError
  value: DateValueType
  onChange: (value: DateValueType) => void
  containerClassName?: string
  popoverDirection?: 'up' | 'down'
}

export const RangeDatePicker: FC<IRangeDatePickerProps> = ({
  name,
  label,
  onChange,
  value,
  containerClassName,
  popoverDirection,
}) => {
  return (
    <div className="flex flex-col gap-y-1 ">
      <label htmlFor={name}>{label}</label>
      <DtPicker
        value={value}
        onChange={onChange}
        showShortcuts={false}
        asSingle={true}
        containerClassName={containerClassName}
        popoverDirection={popoverDirection}
        useRange={false}
      />
    </div>
  )
}
