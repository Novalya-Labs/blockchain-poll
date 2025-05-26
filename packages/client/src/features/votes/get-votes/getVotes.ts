export const getVotes = async (pollId: string) => {
  const response = await fetch(`/api/polls/${pollId}/votes`);
  return response.json();
};
