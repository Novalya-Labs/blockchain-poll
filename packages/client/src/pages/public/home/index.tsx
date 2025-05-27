import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-screen md:h-auto md:min-h-screen md:overflow-auto overflow-hidden">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <h1 className="font-gendy text-4xl font-medium mb-4">{t('home:title')}</h1>
          <p className="text-muted-foreground text-lg">{t('home:subtitle')}</p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
