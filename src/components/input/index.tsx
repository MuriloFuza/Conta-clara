/* eslint-disable react/display-name */
import { forwardRef, InputHTMLAttributes } from 'react'
import { FieldError } from 'react-hook-form'
import clsx from 'clsx'

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: FieldError
  type?: string
}

export const Input = forwardRef<HTMLInputElement, IInputProps>(
  ({ label, error, type, className, name, ...rest }, ref) => {
    if (type === null || type === '' || type === undefined) {
      type = 'text'
    }

    return (
      <div className="flex flex-col gap-y-1">
        <label htmlFor={name}>{label}</label>
        <input
          name={name}
          id={name}
          className={clsx(
            '"h-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900 focus:ring-blue-600 rounded-lg border-0 p-2 bg-neutral-950 outline-none',
            { className: !!className },
          )}
          ref={ref}
          type={type}
          {...rest}
        ></input>
        {error ? (
          <span className="text-xs text-red-600 font-bold">
            {error.message}
          </span>
        ) : null}
      </div>
    )
  },
)
