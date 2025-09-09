import { Outlet } from 'react-router-dom';
import '../App.css';
import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';
import SearchBar from '../ui/SearchBar';
import ScrollToTop from '../ui/ScrollTop';

export default function Main() {
  return (
    <div className='bg-light-beige'>
      <div className='bg-[#2a4125] text-white text-center py-2 text-md font-medium'>
        🚚 Free shipping on orders above 3000 | 🎉 Apply <b>coupon10</b> for
        exclusive 10% discount
      </div>
      <Navbar />
      <SearchBar />
      <ScrollToTop />
      <Outlet />
      <Footer />
    </div>
  );
}
