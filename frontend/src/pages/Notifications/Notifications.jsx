import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './Notifications.module.css';
import { API_BASE_URL } from '../../config';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get(`${API_BASE_URL}/notifications`, config);
      setNotifications(response.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleMarkAsRead = async (notif) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.put(`${API_BASE_URL}/notifications/${notif._id}/read`, {}, config);
      
      // Update local state
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

      // Trigger standard storage update so the profile notification badge updates
      window.dispatchEvent(new Event('storage'));

      if (notif.link) {
        navigate(notif.link);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'offer':
        return '📢';
      case 'new_product':
        return '🍎';
      default:
        return '🔔';
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.notificationsCard}>
            <div className={styles.headerRow}>
              <h2>🔔 Your Notifications</h2>
              <button 
                onClick={fetchNotifications} 
                className={styles.refreshBtn}
                title="Refresh notifications"
              >
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <div className={styles.loadingState}>
                <p>Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className={styles.emptyState}>
                <p>You don't have any notifications yet.</p>
              </div>
            ) : (
              <div className={styles.notificationsList}>
                {notifications.map((notif) => {
                  const isRead = notif.user 
                    ? notif.isRead 
                    : notif.readBy?.includes(user?._id);

                  return (
                    <div
                      key={notif._id}
                      className={`${styles.notificationItem} ${isRead ? styles.read : styles.unread}`}
                      onClick={() => handleMarkAsRead(notif)}
                    >
                      <div className={styles.iconCol}>
                        <span className={styles.typeIcon}>{getNotifIcon(notif.type)}</span>
                      </div>
                      
                      <div className={styles.contentCol}>
                        <div className={styles.titleRow}>
                          <h4 className={styles.notifTitle}>{notif.title}</h4>
                          {!isRead && <span className={styles.unreadDot} />}
                        </div>
                        <p className={styles.notifMessage}>{notif.message}</p>
                        
                        {notif.type === 'offer' && (
                          <div className={styles.actionRow}>
                            <button
                              type="button"
                              className={styles.claimBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notif);
                              }}
                            >
                              Claim Offer 🎁
                            </button>
                          </div>
                        )}

                        {notif.type === 'order' && (
                          <div className={styles.actionRow}>
                            <button
                              type="button"
                              className={styles.reviewBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notif);
                              }}
                            >
                              Give Review ⭐
                            </button>
                          </div>
                        )}

                        <span className={styles.notifTime}>
                          {new Date(notif.createdAt).toLocaleDateString()} at{' '}
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
