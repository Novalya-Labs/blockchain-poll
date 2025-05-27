import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePollStore } from '@/features/polls/pollsStore';
import { useVoteStore } from '@/features/votes/votesStore';
import { adminRoutes } from '@/navigations/urls';
import { ArrowLeft, Calendar, Users, BarChart3 } from 'lucide-react';

const AdminPollDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { poll, loading: pollLoading, error: pollError, getPoll, clearError: clearPollError } = usePollStore();
  const { votes, loading: votesLoading, error: votesError, getVotes, clearError: clearVotesError } = useVoteStore();

  useEffect(() => {
    if (id) {
      getPoll({ id });
      getVotes(id);
    }
    return () => {
      clearPollError();
      clearVotesError();
    };
  }, [id, getPoll, getVotes, clearPollError, clearVotesError]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getVoteCount = (option: { id: string; text: string }) => {
    return votes?.filter((vote) => vote.option.id === option.id).length ?? 0;
  };

  const getTotalVotes = () => {
    return votes?.length ?? 0;
  };

  if (pollLoading && !poll) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-10 mr-4" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (pollError || !poll) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Link to={adminRoutes.polls}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Polls
            </Button>
          </Link>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{pollError || t('admin:pollDetails.pollNotFound')}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to={adminRoutes.polls}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Polls
            </Button>
          </Link>
          <h1 className="text-3xl font-bold ml-4">Poll Details</h1>
        </div>
        <Badge variant={poll.status === 'active' ? 'default' : 'secondary'}>{poll.status}</Badge>
      </div>

      {votesError && (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription>{votesError}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {/* Poll Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              {poll.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {poll.description && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Description</h3>
                  <p className="text-sm">{poll.description}</p>
                </div>
              )}

              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                Created on {formatDate(poll.createdAt)}
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="w-4 h-4 mr-2" />
                {getTotalVotes()} total votes
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Poll Options and Results */}
        <Card>
          <CardHeader>
            <CardTitle>Poll Results</CardTitle>
          </CardHeader>
          <CardContent>
            {votesLoading ? (
              <div className="space-y-4">
                {poll.options?.map((_, index) => (
                  <div key={`loading-${index}`} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {poll.options?.map((option, index) => {
                  const voteCount = getVoteCount(option);
                  const percentage = getTotalVotes() > 0 ? (voteCount / getTotalVotes()) * 100 : 0;

                  return (
                    <div key={`result-${index}`} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{option.text}</span>
                        <span className="text-sm text-muted-foreground">
                          {voteCount} votes ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}

                {(!poll.options || poll.options.length === 0) && (
                  <p className="text-muted-foreground text-center py-4">No options available for this poll.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Votes */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Votes</CardTitle>
          </CardHeader>
          <CardContent>
            {votesLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={`vote-skeleton-${i}`} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            ) : votes.length > 0 ? (
              <div className="space-y-3">
                {votes.slice(0, 10).map((vote, index) => (
                  <div key={vote.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <span className="font-medium">Voter #{index + 1}</span>
                      <span className="text-sm text-muted-foreground ml-2">voted for "{vote.option.text}"</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDate(vote.createdAt)}</span>
                  </div>
                ))}
                {votes.length > 10 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    And {votes.length - 10} more votes...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No votes yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPollDetailsPage;
