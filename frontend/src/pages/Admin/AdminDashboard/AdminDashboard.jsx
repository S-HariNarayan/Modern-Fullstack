import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../../components/AdminSidebar/AdminSidebar';
import styles from './AdminDashboard.module.css';
import { API_BASE_URL } from '../../../config';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [offerLink, setOfferLink] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendOffer = async (e) => {
    e.preventDefault();
    if (!offerTitle || !offerMessage) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setSending(true);
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.post(`${API_BASE_URL}/notifications/offer`, {
        title: offerTitle,
        message: offerMessage,
        link: offerLink
      }, config);

      alert('Offer notification broadcasted to all users successfully!');
      setOfferTitle('');
      setOfferMessage('');
      setOfferLink('');
    } catch (err) {
      console.error('Error broadcasting offer:', err);
      alert('Failed to send announcement notification');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(storedUser);
    if (!user.isAdmin) {
      alert('Access Denied: Admin role required');
      navigate('/home');
      return;
    }

    const fetchAdminData = async () => {
      try {
        setLoading(true);

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        // Fetch all products, orders, users
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/products`),
          axios.get(`${API_BASE_URL}/orders`, config),
          axios.get(`${API_BASE_URL}/auth/users`, config)
        ]);

        const products = productsRes.data;
        const orders = ordersRes.data;
        const users = usersRes.data;

        // Calculate sales sum
        const sales = orders.reduce((sum, order) => sum + order.total, 0);

        setStats({
          totalSales: sales,
          totalOrders: orders.length,
          totalProducts: products.length,
          totalUsers: users.length
        });

        // Set recent 5 orders
        setRecentOrders(orders.slice(0, 5));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return styles.status_processing;
      case 'shipped':
        return styles.status_shipped;
      case 'delivered':
        return styles.status_delivered;
      default:
        return styles.status_pending;
    }
  };

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />

      <main className={styles.mainPanel}>
        <div className={styles.header}>
          <h1>Dashboard Overview</h1>
        </div>

        {loading ? (
          <div>Loading stats database...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>₹</div>
                <div className={styles.statInfo}>
                  <h3>Total Sales</h3>
                  <p>₹{stats.totalSales}</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>📦</div>
                <div className={styles.statInfo}>
                  <h3>Total Orders</h3>
                  <p>{stats.totalOrders}</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>🍎</div>
                <div className={styles.statInfo}>
                  <h3>Total Products</h3>
                  <p>{stats.totalProducts}</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>👥</div>
                <div className={styles.statInfo}>
                  <h3>Registered Users</h3>
                  <p>{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            {/* Broadcast Announcement Form */}
            <div className={styles.formSection}>
              <h2>Broadcast New Offer / Announcement</h2>
              <form onSubmit={handleSendOffer}>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="offerTitle">Announcement Title</label>
                    <input
                      type="text"
                      id="offerTitle"
                      placeholder="e.g. 20% Off All Fruits! 🍓"
                      value={offerTitle}
                      onChange={(e) => setOfferTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="offerLink">Target Link (Optional)</label>
                    <input
                      type="text"
                      id="offerLink"
                      placeholder="e.g. /products or category link"
                      value={offerLink}
                      onChange={(e) => setOfferLink(e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.inputGroup} style={{ marginBottom: '20px' }}>
                  <label htmlFor="offerMessage">Message Content</label>
                  <textarea
                    id="offerMessage"
                    rows="3"
                    placeholder="Describe the offer details..."
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className={styles.sendBtn} disabled={sending}>
                  {sending ? 'Broadcasting...' : 'Broadcast Announcement 📢'}
                </button>
              </form>
            </div>

            {/* Recent Orders Section */}
            <div className={styles.activitySection}>
              <h2>Recent Orders</h2>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Name</th>
                      <th>Placed Date</th>
                      <th>Total Amount</th>
                      <th>Order Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{order._id}</td>
                        <td>{order.user?.fullName || 'Guest Customer'}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>₹{order.total}</td>
                        <td>
                          <span className={`${styles.status} ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {recentOrders.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center' }}>No orders placed yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
