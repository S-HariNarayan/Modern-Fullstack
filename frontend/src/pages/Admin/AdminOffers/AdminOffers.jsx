import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../../components/AdminSidebar/AdminSidebar';
import styles from './AdminOffers.module.css';
import { API_BASE_URL } from '../../../config';

export default function AdminOffers() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [sending, setSending] = useState(false);

  const fetchOffers = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get(`${API_BASE_URL}/notifications`, config);
      // Filter only global offer notifications
      const globalOffers = response.data.filter(n => n.user === null && n.type === 'offer');
      setOffers(globalOffers);
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
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

    fetchOffers();
  }, [navigate]);

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    if (!title || !message) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setSending(true);
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const payload = {
        title,
        message,
        link: link || '/products',
        couponCode: couponCode.trim(),
        discountPercentage: discountPercentage ? Number(discountPercentage) : 0
      };

      await axios.post(`${API_BASE_URL}/notifications/offer`, payload, config);

      alert('Offer broadcasted and coupon added successfully!');
      setTitle('');
      setMessage('');
      setLink('');
      setCouponCode('');
      setDiscountPercentage('');
      fetchOffers();
    } catch (err) {
      console.error('Error creating offer:', err);
      alert(err.response?.data?.message || 'Failed to create offer');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteOffer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer? This will delete the notification and disable the coupon code.')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.delete(`${API_BASE_URL}/notifications/${id}`, config);
      alert('Offer deleted successfully!');
      fetchOffers();
    } catch (err) {
      console.error('Error deleting offer:', err);
      alert('Failed to delete offer');
    }
  };

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />

      <main className={styles.mainPanel}>
        <div className={styles.header}>
          <h1>Offers & Coupon Announcements</h1>
        </div>

        {/* Create Offer Section */}
        <div className={styles.formSection}>
          <h2>📢 Broadcast New Offer / Create Coupon</h2>
          <form onSubmit={handleCreateOffer}>
            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="title">Offer Title</label>
                <input
                  type="text"
                  id="title"
                  placeholder="e.g. 25% Off Summer Fruits! 🍇"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="link">Redirect Link (Optional)</label>
                <input
                  type="text"
                  id="link"
                  placeholder="e.g. /products or category link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="couponCode">Coupon Code (Optional)</label>
                <input
                  type="text"
                  id="couponCode"
                  placeholder="e.g. SUMMER25"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="discountPercentage">Discount Percentage (Optional)</label>
                <input
                  type="number"
                  id="discountPercentage"
                  min="0"
                  max="100"
                  placeholder="e.g. 25"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.inputGroup} style={{ marginBottom: '20px' }}>
              <label htmlFor="message">Offer Message Details</label>
              <textarea
                id="message"
                rows="3"
                placeholder="Describe the offer details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.sendBtn} disabled={sending}>
              {sending ? 'Creating & Broadcasting...' : 'Broadcast Offer & Create Coupon 📢'}
            </button>
          </form>
        </div>

        {/* Active Offers Section */}
        <div className={styles.activitySection}>
          <h2>Active Offers Directory</h2>
          
          {loading ? (
            <div className={styles.loadingText}>Loading active offers...</div>
          ) : offers.length === 0 ? (
            <div className={styles.emptyState}>No active offers broadcasted yet.</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Message</th>
                    <th>Coupon Code</th>
                    <th>Discount</th>
                    <th>Link</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer) => (
                    <tr key={offer._id}>
                      <td style={{ fontWeight: 'bold' }}>{offer.title}</td>
                      <td className={styles.messageCol}>{offer.message}</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {offer.couponCode ? offer.couponCode : <span className={styles.noCoupon}>None</span>}
                      </td>
                      <td>{offer.discountPercentage ? `${offer.discountPercentage}%` : '0%'}</td>
                      <td>
                        <span className={styles.linkText}>{offer.link}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteOffer(offer._id)}
                          className={styles.deleteBtn}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
