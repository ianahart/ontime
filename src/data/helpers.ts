export const getUser = () => {
  const session = localStorage.getItem('supabase.auth.token');
  if (session) {
    const user = JSON.parse(session ?? '').currentSession.user;
    return user.id;
  }
};
