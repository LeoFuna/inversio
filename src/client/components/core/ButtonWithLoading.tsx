'use client';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import React from 'react';

type SpinnerProps = Pick<
  React.ComponentProps<typeof LoadingSpinner>,
  'size' | 'className'
>;

type Props = {
  isLoading?: boolean;
  spinnerProps?: SpinnerProps;
} & React.ComponentProps<typeof Button>;

export default function ButtonWithLoading({
  className,
  spinnerProps,
  isLoading,
  disabled = false,
  children,
}: Props) {
  return (
    <Button className={cn('', className)} disabled={disabled}>
      {isLoading ? (
        <LoadingSpinner
          size={spinnerProps?.size || 24}
          className={cn('text-white', spinnerProps?.className)}
        />
      ) : (
        children
      )}
    </Button>
  );
}
