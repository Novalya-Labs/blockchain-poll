export const getPolls = async () => {
  const response = await fetch('/api/polls', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch polls');
  }

  return response.json();
};
