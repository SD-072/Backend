import { Outlet, useNavigate } from 'react-router';
import useAuth from '@/contexts/useAuth';
import { useEffect } from 'react';

const ProtectedLayout = () => {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate('/login');
  }, [user, navigate, authLoading]);

  if (authLoading) return <p>Loading...</p>;
  if (!user) return null;
  return <Outlet />;
};

export default ProtectedLayout;
