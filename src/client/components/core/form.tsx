import { cn } from '@/lib/utils'
import React from 'react'

export type FormGenericProps<T = unknown> = {
  children: React.ReactNode
  className?: string
} & T

type FormProps = {
  onSubmit: (formData: any) => void
} & FormGenericProps

export function Form({ children, className, onSubmit }: FormProps) {
  return (
     <form className={cn(['mt-6 w-full max-w-xs', className])} onSubmit={onSubmit}>
        { children }
      </form>
  )
}

type FormLabelProps = {
  htmlFor: string
} & FormGenericProps

export function FormLabel({ children, className, htmlFor }: FormLabelProps) {
  return (
    <label className={cn(["block text-sm font-medium text-gray-700", className])} htmlFor={htmlFor}>
      { children }
    </label>
  )
}

export function FormMessage({ message }: { message?: string }) {
  return (
    <p className="mt-2 text-sm text-red-400">
      { message }
    </p>
  )
}