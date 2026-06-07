import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© 2026 Epic Grocery | All Rights Reserved</p>
      <div className={styles.linksContainer}>
        <Link to="/about">About Us</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
      </div>
    </footer>
  );
}
