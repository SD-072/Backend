import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { ChatBtn, Navbar } from '@/components';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@/context';

const RootLayout = () => {
  return (
    <AuthProvider>
      <div className='container mx-auto'>
        <ToastContainer position='bottom-left' autoClose={1500} theme='colored' />
        <Navbar />
        <Outlet />
        <ChatBtn />
      </div>
    </AuthProvider>
  );
};

export default RootLayout;
