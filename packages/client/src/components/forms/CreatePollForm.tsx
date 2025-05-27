import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePollStore } from '@/features/polls/pollsStore';
import { createPollSchema, CreatePollPayload } from '@/features/polls/create-poll/createPoll';
import { Plus, X } from 'lucide-react';

interface CreatePollFormProps {
  onSuccess?: () => void;
}

export const CreatePollForm: React.FC<CreatePollFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { createPoll, loading, error, clearError } = usePollStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [options, setOptions] = useState(['', '']);

  const form = useForm<CreatePollPayload>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      title: '',
      description: '',
      options: ['', ''],
    },
  });

  const onSubmit = async (values: CreatePollPayload) => {
    clearError();
    setIsSubmitting(true);

    try {
      const filteredOptions = options.filter((option) => option.trim() !== '');
      await createPoll({ ...values, options: filteredOptions });
      form.reset();
      setOptions(['', '']);
      onSuccess?.();
    } catch {
      // Error is handled by the store
    } finally {
      setIsSubmitting(false);
    }
  };

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options?.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    form.setValue('options', newOptions);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('forms:createPoll.title')}</FormLabel>
              <FormControl>
                <Input placeholder={t('forms:createPoll.titlePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('forms:createPoll.description')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('forms:createPoll.descriptionPlaceholder')}
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>{t('forms:createPoll.options')}</FormLabel>
            <Button type="button" variant="outline" size="sm" onClick={addOption} disabled={options.length >= 10}>
              <Plus className="w-4 h-4 mr-1" />
              {t('forms:createPoll.addOption')}
            </Button>
          </div>

          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={`option-${index}`} className="flex items-center space-x-2">
                <Input
                  placeholder={`${t('forms:createPoll.optionPlaceholder')} ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                />
                {options.length > 2 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => removeOption(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {options.length < 2 && (
            <p className="text-sm text-muted-foreground">{t('forms:createPoll.minOptionsWarning')}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={loading || isSubmitting} className="min-w-[120px]">
            {loading || isSubmitting ? t('forms:createPoll.creating') : t('forms:createPoll.createPoll')}
          </Button>
        </div>
      </form>
    </Form>
  );
};
