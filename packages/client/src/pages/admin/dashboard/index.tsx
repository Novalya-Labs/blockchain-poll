import { env } from '@/configs/env';
import { adminRoutes } from '@/navigations/urls';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePollStore } from '@/features/polls/pollsStore';
import { CreatePollForm } from '@/components/forms/CreatePollForm';
import { Plus, BarChart3, TrendingUp, Vote, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isCreatePollOpen, setIsCreatePollOpen] = useState(false);

  const { polls, loading: pollsLoading, error: pollsError, getPolls } = usePollStore();

  useEffect(() => {
    getPolls();
  }, [getPolls]);

  const handlePollCreated = () => {
    setIsCreatePollOpen(false);
    getPolls(); // Refresh polls list
  };

  const stats = useMemo(() => {
    const activePolls = polls?.filter((poll) => poll.status === 'active');
    // Mock total votes calculation - in real app this would come from aggregated data
    const estimatedTotalVotes = polls.length * 50; // Rough estimate

    const recentPoll = polls.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    const daysSinceLastPoll = recentPoll
      ? Math.floor((Date.now() - new Date(recentPoll.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return [
      {
        title: t('admin:dashboard.stats.totalPolls'),
        value: pollsLoading ? '...' : polls.length.toString(),
        change: pollsLoading ? '...' : `${activePolls.length} ${t('admin:dashboard.stats.activeStatus')}`,
        icon: BarChart3,
        trend: 'neutral' as const,
      },
      {
        title: t('admin:dashboard.stats.activePolls'),
        value: pollsLoading ? '...' : activePolls.length.toString(),
        change: pollsLoading
          ? '...'
          : `${polls.length - activePolls.length} ${t('admin:dashboard.stats.completedStatus')}`,
        icon: Vote,
        trend: 'neutral' as const,
      },
      {
        title: t('admin:dashboard.stats.totalVotes'),
        value: pollsLoading ? '...' : estimatedTotalVotes.toString(),
        change: pollsLoading ? '...' : t('admin:dashboard.stats.acrossPolls', { count: polls.length }),
        icon: TrendingUp,
        trend: 'up' as const,
      },
      {
        title: t('admin:dashboard.stats.recentActivity'),
        value: pollsLoading ? '...' : recentPoll ? `${daysSinceLastPoll}d` : t('admin:dashboard.stats.none'),
        change: pollsLoading
          ? '...'
          : recentPoll
            ? t('admin:dashboard.stats.lastPollCreated')
            : t('admin:dashboard.stats.noPolls'),
        icon: Clock,
        trend: 'neutral' as const,
      },
    ];
  }, [polls, pollsLoading, t]);

  const quickActions = [
    {
      title: t('admin:dashboard.quickActions.createPoll'),
      description: t('admin:dashboard.quickActions.createPollDescription'),
      icon: Plus,
      action: () => setIsCreatePollOpen(true),
      variant: 'default' as const,
    },
    {
      title: t('admin:dashboard.quickActions.viewPolls'),
      description: t('admin:dashboard.quickActions.viewPollsDescription'),
      icon: BarChart3,
      action: () => navigate(adminRoutes.polls),
      variant: 'outline' as const,
    },
  ];

  const recentPolls = useMemo(() => {
    return polls
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map((poll) => {
        // Mock vote count - in real app this would come from poll data or separate API
        const estimatedVotes = Math.floor(Math.random() * 200) + 50;
        const createdDate = new Date(poll.createdAt);
        const formattedDate = createdDate.toLocaleDateString();

        return {
          id: poll.id,
          title: poll.title,
          status: poll.status,
          votes: estimatedVotes,
          endDate: formattedDate,
          description: poll.description,
        };
      });
  }, [polls]);

  const renderStatsSection = () => (
    <section>
      <h2 className="text-xl font-semibold mb-4">{t('admin:dashboard.stats.title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );

  const renderRecentPollsSection = () => (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{t('admin:dashboard.recentPolls.title')}</h2>
        <Button variant="outline" onClick={() => navigate(adminRoutes.polls)}>
          {t('admin:dashboard.recentPolls.viewAll')}
        </Button>
      </div>
      <div className="space-y-4">
        {pollsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : pollsError ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="font-medium mb-2">{t('admin:dashboard.recentPolls.error')}</h3>
              <p className="text-muted-foreground mb-4">{pollsError}</p>
              <Button onClick={() => getPolls()} variant="outline">
                {t('common:actions.tryAgain')}
              </Button>
            </CardContent>
          </Card>
        ) : recentPolls.length > 0 ? (
          recentPolls.map((poll) => (
            <Card key={poll.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{poll.title}</h3>
                      <Badge variant={poll.status === 'active' ? 'default' : 'secondary'}>
                        {poll.status === 'active' ? (
                          <>
                            <Vote className="h-3 w-3 mr-1" />
                            {t('common:status.active')}
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {t('common:status.completed')}
                          </>
                        )}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t('admin:dashboard.recentPolls.votesCount', { count: poll.votes })} •{' '}
                      {t('admin:dashboard.recentPolls.createdOn', { date: poll.endDate })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(adminRoutes.pollDetails.replace(':id', poll.id))}
                  >
                    {t('common:actions.viewDetails')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">{t('admin:dashboard.recentPolls.noPollsYet')}</h3>
              <p className="text-muted-foreground mb-4">{t('admin:dashboard.recentPolls.createFirst')}</p>
              <Button onClick={() => navigate(adminRoutes.pollsCreate)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('admin:dashboard.recentPolls.createFirstButton')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );

  return (
    <>
      <Helmet>
        <title>{`${env.app.name} | ${t('admin:dashboard.title')}`}</title>
        <link rel="canonical" href={`${window.location.origin}${adminRoutes.dashboard}`} />
      </Helmet>
      <div className="h-full flex">
        <div className="flex-1 overflow-auto flex justify-center bg-background">
          <div className="w-full max-w-7xl p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{t('admin:dashboard.welcome')}</h1>
              <p className="text-muted-foreground text-lg">{t('admin:dashboard.subtitle')}</p>
            </div>

            <div className="space-y-8">
              {renderStatsSection()}

              <section>
                <h2 className="text-xl font-semibold mb-4">{t('admin:dashboard.quickActions.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={action.action}
                    >
                      <CardHeader className="text-center">
                        <div className="mx-auto mb-2 p-3 rounded-full bg-primary/10 w-fit">
                          <action.icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{action.title}</CardTitle>
                        <CardDescription>{action.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button variant={action.variant} className="w-full">
                          {t('common:actions.getStarted')}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {renderRecentPollsSection()}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isCreatePollOpen} onOpenChange={setIsCreatePollOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('admin:dashboard.quickActions.createPoll')}</DialogTitle>
          </DialogHeader>
          <CreatePollForm onSuccess={handlePollCreated} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardPage;
