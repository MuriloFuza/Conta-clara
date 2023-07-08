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
            ' rounded-lg border border-gray-300 bg-gray-200 py-2 px-4 text-gray-700 file:bg-blue-500 file:text-white file:mr-2 file:transition-all file:py-1 file:px-2 file:h-full file:-ml-1 file:rounded-md file:border-0 file:text-sm file:font-semibold hover:file:bg-blue-600 focus:border-blue-900/25 focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-600/40',
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
