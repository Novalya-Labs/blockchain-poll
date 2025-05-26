export const getVotes = async (pollId: string) => {
  const response = await fetch(`/api/polls/${pollId}/votes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch votes');
  }

  return response.json();
};
