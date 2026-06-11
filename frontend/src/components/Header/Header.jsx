import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './Header.module.css';
import { API_BASE_URL } from '../../config';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('appTheme') || 'original';
    return saved === 'dark-neon' ? 'dark-neon' : 'original';
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
    setNotificationsOpen(false);
  }, [location]);

  useEffect(() => {
    // Read user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }

    // Set theme initial state on mount
    document.body.setAttribute('data-theme', theme);

    // Read cart items to calculate count
    const updateCartCount = () => {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const cartItems = JSON.parse(storedCart);
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();

    // Listen to storage events or custom cart updates
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, [location, theme]);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get(`${API_BASE_URL}/notifications`, config);
      setNotifications(response.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAsRead = async (notif) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.put(`${API_BASE_URL}/notifications/${notif._id}/read`, {}, config);
      setNotifications(prev =>
        prev.map(n => {
          if (n._id === notif._id) {
            if (n.user) {
              return { ...n, isRead: true };
            } else {
              return { ...n, readBy: [...(n.readBy || []), user?._id] };
            }
          }
          return n;
        })
      );
      setNotificationsOpen(false);
      if (notif.link) {
        navigate(notif.link);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const unreadNotifications = notifications.filter(n => {
    if (n.user) {
      return !n.isRead;
    } else {
      return user && !n.readBy?.includes(user._id);
    }
  });
  const unreadCount = unreadNotifications.length;

  const toggleTheme = () => {
    const nextTheme = theme === 'dark-neon' ? 'original' : 'dark-neon';
    setTheme(nextTheme);
    document.body.setAttribute('data-theme', nextTheme);
    localStorage.setItem('appTheme', nextTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    // Dispatch event to clear cart badges elsewhere
    window.dispatchEvent(new Event('cartUpdated'));
    alert('Logged out successfully');
    navigate('/');
  };

  if (!user) {
    return (
      <header className={styles.navbar}>
        <Link to="/" className={styles.logo}>
          <img src="/images/Screenshot 2026-05-25 213956.png" alt="Epic Grocery Logo" />
          <h1>Epic Grocery</h1>
        </Link>
        <div className={styles.navLinks}>
          <ul>
            <li>
              <button onClick={toggleTheme} className={styles.themeToggleBtn} aria-label="Toggle theme">
                {theme === 'dark-neon' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.themeIcon}>
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.themeIcon}>
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                )}
              </button>
            </li>
            <li className={styles.menuContainer} ref={dropdownRef}>
              <button onClick={() => setMenuOpen(!menuOpen)} className={styles.menuBtn}>
                Menu ☰
              </button>
              {menuOpen && (
                <div className={styles.dropdownMenu}>
                  <Link to="/" className={styles.dropdownItem}>🏠 Home</Link>
                  <Link to="/about" className={styles.dropdownItem}>ℹ️ About Us</Link>
                  <Link to="/categories" className={styles.dropdownItem}>📁 Categories</Link>
                  <Link to="/products" className={styles.dropdownItem}>📦 Products</Link>
                  <Link to="/cart" className={styles.dropdownItem}>🛒 Cart</Link>
                  <Link to="/profile" className={styles.dropdownItem}>👤 Profile</Link>
                  <Link to="/privacy-policy" className={styles.dropdownItem}>🔒 Privacy Policy</Link>
                  <Link to="/faq" className={styles.dropdownItem}>❓ FAQ</Link>
                  <Link to="/contact" className={styles.dropdownItem}>📞 Contact Us</Link>
                  <hr className={styles.divider} />
                  <Link to="/login" className={styles.dropdownItem}>🔑 Login</Link>
                  <Link to="/signup" className={styles.dropdownItem}>📝 Register</Link>
                  <Link to="/forget-password" className={styles.dropdownItem}>❓ Forgot Password</Link>
                </div>
              )}
            </li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Register</Link></li>
          </ul>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.navbar}>
      <Link to="/" className={styles.logo}>
        <img src="/images/Screenshot 2026-05-25 213956.png" alt="Epic Grocery Logo" />
        <h1>Epic Grocery</h1>
      </Link>
      <div className={styles.navLinks}>
        <ul>
          <li>
            <button onClick={toggleTheme} className={styles.themeToggleBtn} aria-label="Toggle theme">
              {theme === 'dark-neon' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.themeIcon}>
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.themeIcon}>
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
          </li>
          <li className={styles.menuContainer} ref={dropdownRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className={styles.menuBtn}>
              Menu ☰
            </button>
            {menuOpen && (
              <div className={styles.dropdownMenu}>
                <Link to="/" className={styles.dropdownItem}>🏠 Home</Link>
                <Link to="/about" className={styles.dropdownItem}>ℹ️ About Us</Link>
                <Link to="/categories" className={styles.dropdownItem}>📁 Categories</Link>
                <Link to="/products" className={styles.dropdownItem}>📦 Products</Link>
                <Link to="/cart" className={styles.dropdownItem}>🛒 Cart {cartCount > 0 && `(${cartCount})`}</Link>
                <Link to="/profile" className={styles.dropdownItem}>👤 Profile</Link>
                <Link to="/privacy-policy" className={styles.dropdownItem}>🔒 Privacy Policy</Link>
                <Link to="/faq" className={styles.dropdownItem}>❓ FAQ</Link>
                <Link to="/contact" className={styles.dropdownItem}>📞 Contact Us</Link>
                {user.isAdmin && (
                  <>
                    <hr className={styles.divider} />
                    <Link to="/admin/dashboard" className={styles.dropdownItem}>🛠️ Admin Dashboard</Link>
                  </>
                )}
              </div>
            )}
          </li>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">AboutUs</Link></li>
          <li><Link to="/categories">Categories</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li>
            <Link to="/cart">
              Cart {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </Link>
          </li>
          <li className={styles.profileContainer} ref={profileRef}>
            <button onClick={() => setProfileOpen(!profileOpen)} className={styles.profileBtn} aria-label="User profile">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.profileIcon}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {unreadCount > 0 && <span className={styles.profileNotificationBadge}>{unreadCount}</span>}
            </button>
            {profileOpen && (
              <div className={styles.profileDropdownMenu}>
                <div className={styles.profileHeader}>
                  <p className={styles.profileGreeting}>Hello, {user.fullName || 'User'}!</p>
                  <p className={styles.profileEmail}>{user.email}</p>
                </div>
                <hr className={styles.divider} />
                <Link to="/profile" className={styles.dropdownItem}>👤 My Profile</Link>
                <Link to="/notifications" className={styles.dropdownItem}>
                  🔔 Notifications {unreadCount > 0 && <span className={styles.notifBadgeSmall}>{unreadCount}</span>}
                </Link>
                {user.isAdmin && (
                  <Link to="/admin/dashboard" className={styles.dropdownItem}>🛠️ Admin Panel</Link>
                )}
                <hr className={styles.divider} />
                <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.profileLogoutBtn}`}>
                  🚪 Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}
