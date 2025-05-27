import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePollStore } from '@/features/polls/pollsStore';
import { useVoteStore } from '@/features/votes/votesStore';
import { getVote, type VoteStatusResponse } from '@/features/votes/get-vote/getVote';
import { civilRoutes } from '@/navigations/urls';
import { ArrowLeft, Vote, CheckCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const CivilVoteOnPollPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { poll, loading: pollLoading, error: pollError, getPoll, clearError: clearPollError } = usePollStore();
  const { createVote, loading: voteLoading, error: voteError, clearError: clearVoteError } = useVoteStore();

  const [selectedOption, setSelectedOption] = useState<string>('');
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock voter ID - in real app this would come from auth
  const voterId = 'voter-123';

  useEffect(() => {
    if (id) {
      getPoll({ id });
      // Check if user has already voted
      getVote({ pollId: id })
        .then((result: VoteStatusResponse) => {
          if (result?.hasVoted) {
            setHasVoted(true);
          }
        })
        .catch(() => {
          // User hasn't voted yet, which is fine
        });
    }
    return () => {
      clearPollError();
      clearVoteError();
    };
  }, [id, getPoll, clearPollError, clearVoteError]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleVote = async () => {
    if (!selectedOption || !id) return;

    clearVoteError();
    setIsSubmitting(true);

    try {
      await createVote(id, {
        voterId,
        choice: selectedOption,
      });

      toast.success('Vote submitted successfully!');
      setHasVoted(true);

      // Redirect after a short delay
      setTimeout(() => {
        navigate(civilRoutes.vote);
      }, 2000);
    } catch {
      toast.error('Failed to submit vote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pollLoading && !poll) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-10 mr-4" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={`skeleton-${i}`} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
              <Skeleton className="h-10 w-full mt-6" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (pollError || !poll) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Link to={civilRoutes.vote}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Polls
            </Button>
          </Link>
        </div>
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertDescription>{pollError || 'Poll not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (poll.status !== 'active') {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Link to={civilRoutes.vote}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Polls
            </Button>
          </Link>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-12">
            <Vote className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Poll Closed</h3>
            <p className="text-muted-foreground">This poll is no longer accepting votes.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Link to={civilRoutes.vote}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Polls
            </Button>
          </Link>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-12">
            <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Already Voted</h3>
            <p className="text-muted-foreground mb-4">
              You have already cast your vote for this poll. Thank you for participating!
            </p>
            <Link to={civilRoutes.vote}>
              <Button>View Other Polls</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Link to={civilRoutes.vote}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Polls
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-4">Cast Your Vote</h1>
      </div>

      {voteError && (
        <Alert className="mb-6 max-w-2xl mx-auto" variant="destructive">
          <AlertDescription>{voteError}</AlertDescription>
        </Alert>
      )}

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl">{poll.title}</CardTitle>
            <Badge variant="default">Active</Badge>
          </div>
          {poll.description && <p className="text-muted-foreground">{poll.description}</p>}
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            Created on {formatDate(poll.createdAt)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Choose your option:</h3>
              <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                {poll.options?.map((option, index) => (
                  <div
                    key={`vote-option-${index}`}
                    className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <RadioGroupItem value={option.text} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {(!poll.options || poll.options.length === 0) && (
              <Alert>
                <AlertDescription>
                  This poll has no options available. Please contact the administrator.
                </AlertDescription>
              </Alert>
            )}

            <div className="pt-4 border-t">
              <Button
                onClick={handleVote}
                disabled={!selectedOption || voteLoading || isSubmitting || !poll.options || poll.options.length === 0}
                className="w-full"
                size="lg"
              >
                {voteLoading || isSubmitting ? (
                  'Submitting Vote...'
                ) : (
                  <>
                    <Vote className="w-4 h-4 mr-2" />
                    Submit Vote
                  </>
                )}
              </Button>

              {selectedOption && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                  You selected: <span className="font-medium">{selectedOption}</span>
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CivilVoteOnPollPage;
