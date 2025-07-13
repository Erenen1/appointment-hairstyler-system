// components/ui/submit-button.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface SubmitButtonProps {
  form: UseFormReturn<any>;
  children: React.ReactNode;
  className?: string;
  loadingText?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const GlobalDebuggerButton = ({
  form,
  children,
  className = 'w-full',
  loadingText = 'Yükleniyor...',
  isLoading = false,
  disabled = false,
  onClick,
  variant = 'default',
  size = 'default'
}: SubmitButtonProps) => {
  const isFormValid = form.formState.isValid;
  const isFormSubmitting = form.formState.isSubmitting;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    console.log('Buttona tıklandı!!');
    console.log('Form verisi:', isFormValid);
    console.log('Form hatası:', form.formState.errors);
  };

  return (
    <Button
      type="submit"
      className={className}
      variant={variant}
      size={size}
      disabled={!isFormValid || isFormSubmitting || isLoading || disabled}
      onClick={handleClick}
    >
      {(isLoading || isFormSubmitting) && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {(isLoading || isFormSubmitting) ? loadingText : children}
    </Button>
  );
};