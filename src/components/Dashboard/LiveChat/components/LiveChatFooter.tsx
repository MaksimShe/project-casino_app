'use client';

import { type FC, type KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/shared/Input';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from '@/i18n/useTranslation';

interface Props {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

interface FormData {
  message: string;
}

export const LiveChatFooter: FC<Props> = ({ onSendMessage, disabled }) => {
  const { register, handleSubmit, reset, watch } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      message: '',
    },
  });
  const { t } = useTranslation();

  const messageValue = watch('message');

  const onSubmit = (data: FormData) => {
    if (data.message.trim() && !disabled) {
      onSendMessage(data.message);
      reset();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-2 flex w-11/12 items-center gap-2 max-lg:absolute max-lg:right-6 max-lg:bottom-8 max-lg:left-6"
    >
      <div className="flex-1">
        <Input
          placeholder={disabled ? '...' : t.chat.messagePlaceholder}
          {...register('message', {
            required: true,
            validate: value => value.trim().length > 0,
          })}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={twMerge(
            'h-12 w-full rounded-4xl bg-[#7C7CE854] text-[var(--main-text-color)] backdrop-blur-sm',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        />
      </div>
      <button
        type="submit"
        disabled={disabled || !messageValue?.trim()}
        className={twMerge(
          'h-12 w-12 shrink-0 rounded-4xl bg-[#7C7CE854] text-2xl font-black text-[var(--main-text-color)] backdrop-blur-sm transition-colors',
          disabled || !messageValue?.trim()
            ? 'cursor-not-allowed opacity-50'
            : 'hover:bg-[#3A88FF]'
        )}
      >
        ↑
      </button>
    </form>
  );
};
