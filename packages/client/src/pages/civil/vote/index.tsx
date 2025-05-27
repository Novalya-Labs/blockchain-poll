import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePollStore } from '@/features/polls/pollsStore';
import { civilRoutes } from '@/navigations/urls';
import { Vote, Calendar, Users } from 'lucide-react';

const CivilVotePage: React.FC = () => {
  const { t } = useTranslation();
  const { polls, loading, error, getPolls, clearError } = usePollStore();

  useEffect(() => {
    getPolls();
    return () => clearError();
  }, [getPolls, clearError]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const activePolls = polls;

  if (loading && polls.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={`skeleton-${i}`}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('civil:vote.title')}</h1>
        <p className="text-muted-foreground">{t('civil:vote.subtitle')}</p>
      </div>

      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {activePolls.length === 0 ? (
        <Card className="mb-10">
          <CardContent className="text-center py-12">
            <Vote className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('civil:vote.noActivePolls')}</h3>
            <p className="text-muted-foreground">{t('civil:vote.noActivePollsDescription')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activePolls.map((poll) => (
            <Card key={poll.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{poll.title}</CardTitle>
                  <Badge variant="default" className="ml-2">
                    {t('common:status.active')}
                  </Badge>
                </div>
                {poll.description && <p className="text-sm text-muted-foreground line-clamp-3">{poll.description}</p>}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(poll.createdAt)}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {t('civil:vote.optionsLabel')} {poll.options?.length || 0}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">{t('civil:vote.optionsLabel')}</p>
                    <div className="flex flex-wrap gap-1">
                      {poll.options?.slice(0, 3).map((option, index) => (
                        <Badge key={`option-${index}`} variant="secondary" className="text-xs">
                          {option.text.length > 15 ? `${option.text.substring(0, 15)}...` : option.text}
                        </Badge>
                      ))}
                      {poll.options && poll.options.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{poll.options.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Link to={civilRoutes.voteOnPoll.replace(':id', poll.id)} className="block">
                    <Button className="w-full">
                      <Vote className="w-4 h-4 mr-2" />
                      {t('civil:vote.voteNow')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {polls.length > 0 && activePolls.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Vote className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">All Polls Closed</h3>
            <p className="text-muted-foreground">
              All available polls have been closed. No voting is currently available.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CivilVotePage;
