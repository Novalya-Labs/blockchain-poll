import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { env } from '@/configs/env';
import { useAuthStore } from '@/features/auth/authStore';
import { type SignInPayload, signInSchema } from '@/features/auth/sign-in/signIn';
import { adminRoutes, civilRoutes, publicRoutes } from '@/navigations/urls';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const { signIn, loading, error, clearError, role, isAuthenticated } = useAuthStore();
  const { t } = useTranslation();
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (role) {
      navigate(role === 'admin' ? adminRoutes.dashboard : civilRoutes.dashboard);
    }
  }, [role, navigate, isAuthenticated]);

  const form = useForm<SignInPayload>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      role: 'civil',
      password: '',
      id: id,
    },
  });

  const onSubmit = async (values: SignInPayload) => {
    clearError();
    try {
      await signIn(values);
    } catch (_error) {
      // Error is handled by the store
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${env.app.name} | ${t('auth:signIn.signIn')}`}</title>
        <link rel="canonical" href={`${window.location.origin}/${publicRoutes.signIn}`} />
      </Helmet>
      <div className="flex flex-col min-h-screen text-foreground bg-background w-full">
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <h1 className="font-gendy text-4xl font-medium mb-3">{t('auth:signIn.title')}</h1>
              <p className="text-muted-foreground text-lg font-thicccboi">{t('auth:signIn.subtitle')}</p>
            </div>

            <div className="p-8 text-card-foreground rounded-xl border border-border">
              {error && (
                <Alert className="mb-6 bg-destructive/20 text-destructive border border-destructive/50 rounded-xl">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel
                          className="text-sm font-medium block mb-1"
                          style={{ fontFamily: "'Creato Display', sans-serif" }}
                        >
                          {t('auth:signIn.rolePlaceholder')}
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-full h-14 px-5 rounded-xl">
                            <SelectValue placeholder={t('auth:signIn.rolePlaceholder')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="civil">{t('auth:signIn.role.civil')}</SelectItem>
                            <SelectItem value="admin">{t('auth:signIn.role.admin')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-destructive text-sm mt-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel
                          className="text-sm font-medium block mb-1"
                          style={{ fontFamily: "'Creato Display', sans-serif" }}
                        >
                          {t('auth:signIn.email')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t('auth:signIn.emailPlaceholder')}
                            type="email"
                            autoComplete="email"
                            className="auth-input rounded-xl h-14 px-5 placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-destructive text-sm mt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <div className="flex justify-between items-center mb-1">
                          <FormLabel
                            className="text-sm font-medium"
                            style={{
                              fontFamily: "'Creato Display', sans-serif",
                            }}
                          >
                            {t('auth:signIn.password')}
                          </FormLabel>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder={t('auth:signIn.passwordPlaceholder')}
                              type={showPassword ? 'text' : 'password'}
                              autoComplete="current-password"
                              className="auth-input rounded-xl h-14 px-5 placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 pr-12"
                            />
                            <button
                              type="button"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-destructive text-sm mt-1" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 rounded-xl gradient-btn overflow-hidden flex items-center justify-center border border-border cursor-pointer mt-8"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        <span className="font-semibold text-base">{t('auth:signIn.loggingInButton')}</span>
                      </>
                    ) : (
                      <span className="font-semibold text-base">{t('auth:signIn.loginButton')}</span>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SignInPage;
