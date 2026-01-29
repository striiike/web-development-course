export const load = ({ params }) => {
  const action = params.action;

  if (action !== 'login' && action !== 'register') {
    throw new Error('Invalid action');
  }

  return {
    action,
  };
};
