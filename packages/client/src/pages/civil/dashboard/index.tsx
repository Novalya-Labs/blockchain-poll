import { env } from '@/configs/env';
import { civilRoutes } from '@/navigations/urls';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const CivilDashboardPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{`${env.app.name} | ${t('civil:dashboard.title')}`}</title>
        <link rel="canonical" href={`${window.location.origin}${civilRoutes.dashboard}`} />
      </Helmet>
      <div className="h-full flex">
        <div className="flex-1 overflow-auto flex justify-center bg-background">
          <div className="w-full max-w-7xl p-6">
            <h1 className="text-3xl font-bold mb-8">{t('civil:dashboard.title')}</h1>

            <div className="space-y-8">
              <section>
                <h1>Dashboard</h1>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CivilDashboardPage;
