export const getVotes = async () => {
  const response = await fetch('/api/votes');
  return response.json();
};
