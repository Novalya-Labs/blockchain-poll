import { env } from '@/configs/env';
import { civilRoutes } from '@/navigations/urls';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { usePollStore } from '@/features/polls/pollsStore';
import { useVoteStore } from '@/features/votes/votesStore';
import { useAuthStore } from '@/features/auth/authStore';
import { Vote, Bell, Clock, Users, Calendar, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';

const CivilDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { polls, loading: pollsLoading, error: pollsError, getPolls } = usePollStore();
  const { votes, loading: votesLoading } = useVoteStore();
  const { voterId } = useAuthStore();

  useEffect(() => {
    getPolls();
  }, [getPolls]);

  const userVotes = useMemo(() => {
    return votes.filter((vote) => vote.voterId === voterId);
  }, [votes, voterId]);

  const stats = useMemo(() => {
    const activePolls = polls.filter((poll) => poll.status === 'active');
    const userPollsVoted = userVotes.length;
    const upcomingPolls = 0; // This would need to be calculated based on start dates if available

    const lastVote = userVotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    const daysSinceLastVote = lastVote
      ? Math.floor((Date.now() - new Date(lastVote.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return [
      {
        title: t('civil:dashboard.stats.pollsVoted'),
        value: pollsLoading ? '...' : userPollsVoted.toString(),
        change: pollsLoading ? '...' : `out of ${polls.length} total`,
        icon: CheckCircle,
        trend: 'up' as const,
      },
      {
        title: t('civil:dashboard.stats.activePolls'),
        value: pollsLoading ? '...' : activePolls.length.toString(),
        change: pollsLoading ? '...' : 'available to vote',
        icon: Vote,
        trend: 'neutral' as const,
      },
      {
        title: t('civil:dashboard.stats.upcomingPolls'),
        value: pollsLoading ? '...' : upcomingPolls.toString(),
        change: pollsLoading ? '...' : 'starting soon',
        icon: Calendar,
        trend: 'neutral' as const,
      },
      {
        title: t('civil:dashboard.stats.lastActivity'),
        value: votesLoading ? '...' : lastVote ? `${daysSinceLastVote}d` : 'None',
        change: votesLoading ? '...' : lastVote ? 'last vote cast' : 'No votes yet',
        icon: Clock,
        trend: 'neutral' as const,
      },
    ];
  }, [polls, userVotes, pollsLoading, votesLoading, t]);

  const quickActions = [
    {
      title: t('civil:dashboard.quickActions.browsePolls'),
      description: 'Find and participate in active polls',
      icon: Vote,
      action: () => navigate(civilRoutes.vote),
      variant: 'default' as const,
    },
  ];

  const activePolls = useMemo(() => {
    return polls
      .filter((poll) => poll.status === 'active')
      .slice(0, 3)
      .map((poll) => {
        const pollVotes = votes.filter((vote) => vote.pollId === poll.id);
        const userHasVoted = userVotes.some((vote) => vote.pollId === poll.id);
        const createdDate = new Date(poll.createdAt);
        const daysSinceCreated = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

        // Mock some additional data that might come from a real API
        const estimatedParticipants = Math.max(100, pollVotes.length * 2);
        const progress = Math.min(95, (pollVotes.length / estimatedParticipants) * 100);
        const isUrgent = daysSinceCreated > 7; // Consider urgent if older than 7 days

        return {
          id: poll.id,
          title: poll.title,
          description: poll.description || 'Help make important community decisions',
          timeLeft: `${Math.max(1, 14 - daysSinceCreated)} days`,
          participants: pollVotes.length,
          progress: Math.round(progress),
          category: 'Community',
          urgent: isUrgent,
          userHasVoted,
        };
      });
  }, [polls, votes, userVotes]);

  const recentActivity = useMemo(() => {
    return userVotes
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map((vote) => {
        const poll = polls.find((p) => p.id === vote.pollId);
        const createdDate = new Date(vote.createdAt);
        const daysSince = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

        return {
          action: 'Voted on',
          poll: poll?.title || 'Unknown Poll',
          time: daysSince === 0 ? 'Today' : daysSince === 1 ? 'Yesterday' : `${daysSince} days ago`,
          icon: Vote,
        };
      });
  }, [userVotes, polls]);

  const renderStatsSection = () => (
    <section>
      <h2 className="text-xl font-semibold mb-4">{t('civil:dashboard.stats.title')}</h2>
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

  const renderActivePollsSection = () => (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{t('civil:dashboard.activePolls.title')}</h2>
        <Button variant="outline" onClick={() => navigate(civilRoutes.vote)}>
          {t('civil:dashboard.activePolls.viewAll')}
        </Button>
      </div>
      <div className="space-y-4">
        {pollsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                    <Skeleton className="h-10 w-24 ml-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : pollsError ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="font-medium mb-2">{t('civil:dashboard.activePolls.error')}</h3>
              <p className="text-muted-foreground mb-4">{pollsError}</p>
              <Button onClick={() => getPolls()} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : activePolls.length > 0 ? (
          activePolls.map((poll) => (
            <Card key={poll.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{poll.title}</h3>
                      {poll.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {poll.category}
                      </Badge>
                      {poll.userHasVoted && (
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Voted
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">{poll.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {t('civil:dashboard.activePolls.timeLeft')}: {poll.timeLeft}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {poll.participants} {t('civil:dashboard.activePolls.votes')}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Participation</span>
                        <span>{poll.progress}%</span>
                      </div>
                      <Progress value={poll.progress} className="h-2" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <Button
                      onClick={() => navigate(`${civilRoutes.voteOnPoll.replace(':id', poll.id)}`)}
                      disabled={poll.userHasVoted}
                      variant={poll.userHasVoted ? 'outline' : 'default'}
                    >
                      <Vote className="h-4 w-4 mr-2" />
                      {poll.userHasVoted ? 'View Results' : t('civil:dashboard.activePolls.voteNow')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">{t('civil:dashboard.activePolls.noPollsActive')}</h3>
              <p className="text-muted-foreground mb-4">{t('civil:dashboard.activePolls.checkBackLater')}</p>
              <Button variant="outline" onClick={() => navigate(civilRoutes.vote)}>
                <Bell className="h-4 w-4 mr-2" />
                Get Notified
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );

  const renderRecentActivitySection = () => (
    <section>
      <h2 className="text-xl font-semibold mb-4">{t('civil:dashboard.recentActivity.title')}</h2>
      <Card>
        <CardContent className="p-6">
          {votesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-full bg-primary/10">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span> {activity.poll}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">{t('civil:dashboard.recentActivity.noActivity')}</h3>
              <p className="text-muted-foreground">{t('civil:dashboard.recentActivity.startVoting')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );

  return (
    <>
      <Helmet>
        <title>{`${env.app.name} | ${t('civil:dashboard.title')}`}</title>
        <link rel="canonical" href={`${window.location.origin}${civilRoutes.dashboard}`} />
      </Helmet>
      <div className="h-full flex">
        <div className="flex-1 overflow-auto flex justify-center bg-background">
          <div className="w-full max-w-7xl p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{t('civil:dashboard.welcome')}</h1>
              <p className="text-muted-foreground text-lg">{t('civil:dashboard.subtitle')}</p>
            </div>

            <div className="space-y-8">
              {renderStatsSection()}

              <section>
                <h2 className="text-xl font-semibold mb-4">{t('civil:dashboard.quickActions.title')}</h2>
                <div className="grid grid-cols-1 gap-4">
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
                          Get Started
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {renderActivePollsSection()}

              {renderRecentActivitySection()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CivilDashboardPage;
