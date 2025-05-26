export const getPolls = async () => {
  const response = await fetch('/api/polls');
  return response.json();
};
