import useAuth from '@/contexts/useAuth';
import { authServiceURL } from '@/utils';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${authServiceURL}/logout`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Logout failed');
      setUser(null);
      navigate('/');
      toast.success('Bye');
    } catch (error: unknown) {
      const message = (error as { message: string }).message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='navbar bg-base-100'>
      <div className='flex-1'>
        <Link to='/' className='btn btn-ghost text-xl'>
          Travel journal
          <span role='img' aria-labelledby='airplane'>
            🛫
          </span>
          <span role='img' aria-labelledby='heart'>
            ❤️
          </span>
        </Link>
      </div>
      <div className='flex-none'>
        <ul className='menu menu-horizontal px-1'>
          <li>
            <NavLink to='/'>Home</NavLink>
          </li>
          {user ? (
            <>
              <li>
                <NavLink to='/create'>Create post</NavLink>
              </li>
              <li>
                <button type='button' disabled={loading} onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to='/register'>Register</NavLink>
              </li>
              <li>
                <NavLink to='/login'>Login</NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
