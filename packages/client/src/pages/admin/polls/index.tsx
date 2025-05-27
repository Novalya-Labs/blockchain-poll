import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePollStore } from '@/features/polls/pollsStore';
import { adminRoutes } from '@/navigations/urls';
import { Plus, Eye, Calendar } from 'lucide-react';
import { CreatePollForm } from '@/components/forms/CreatePollForm';

const AdminPollsPage: React.FC = () => {
  const { t } = useTranslation();
  const { polls, loading, error, getPolls, clearError } = usePollStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    getPolls(); // Refresh the list
  };

  if (loading && polls.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={`skeleton-${i}`} className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('admin:polls.title')}</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t('admin:polls.createPoll')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t('admin:polls.createNewPoll')}</DialogTitle>
            </DialogHeader>
            <CreatePollForm onSuccess={handleCreateSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('admin:polls.allPolls')}</CardTitle>
        </CardHeader>
        <CardContent>
          {polls.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">{t('admin:polls.noPollsYet')}</p>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('admin:polls.createFirstPoll')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{t('admin:polls.createNewPoll')}</DialogTitle>
                  </DialogHeader>
                  <CreatePollForm onSuccess={handleCreateSuccess} />
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin:polls.table.title')}</TableHead>
                  <TableHead>{t('admin:polls.table.description')}</TableHead>
                  <TableHead>{t('admin:polls.table.options')}</TableHead>
                  <TableHead>{t('admin:polls.table.status')}</TableHead>
                  <TableHead>{t('admin:polls.table.created')}</TableHead>
                  <TableHead>{t('admin:polls.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {polls.map((poll) => (
                  <TableRow key={poll.id}>
                    <TableCell className="font-medium">{poll.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{poll.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {t('admin:polls.table.optionsCount', { count: poll.options?.length || 0 })}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={poll.status === 'active' ? 'default' : 'secondary'}>{poll.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(poll.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link to={adminRoutes.pollDetails.replace(':id', poll.id)}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          {t('admin:polls.table.view')}
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPollsPage;
