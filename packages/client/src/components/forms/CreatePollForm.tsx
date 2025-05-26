import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
      setOptions(options.filter((_, i) => i !== index));
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
              <FormLabel>Poll Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter poll title..." {...field} />
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
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter poll description..." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Poll Options</FormLabel>
            <Button type="button" variant="outline" size="sm" onClick={addOption} disabled={options.length >= 10}>
              <Plus className="w-4 h-4 mr-1" />
              Add Option
            </Button>
          </div>

          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={`option-${index}`} className="flex items-center space-x-2">
                <Input
                  placeholder={`Option ${index + 1}`}
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

          {options.length < 2 && <p className="text-sm text-muted-foreground">A poll must have at least 2 options.</p>}
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={loading || isSubmitting} className="min-w-[120px]">
            {loading || isSubmitting ? 'Creating...' : 'Create Poll'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
