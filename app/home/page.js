'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../styles/HomePage.module.css';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Decode JWT token to get user info (basic implementation)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    } catch (error) {
      console.error('Error decoding token:', error);
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!user) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🧩</span>
          <span className={styles.logoText}>CraftTracker</span>
        </div>
        <nav className={styles.nav}>
          <Link href="/home" className={styles.navLink}>Home</Link>
          <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
          <Link href="/projects" className={styles.navLink}>Projects</Link>
        </nav>
        <div className={styles.userSection}>
          <Link href="/projects/new" className={styles.newProjectBtn}>
            <span className={styles.plusIcon}>+</span>
            New Project
          </Link>
          <div className={styles.userInfo}>
            <span className={styles.userIcon}>👤</span>
            <span className={styles.username}>{user.email.split('@')[0]}</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <span className={styles.logoutIcon}>↪</span>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Welcome to CraftTracker</h1>
          <p className={styles.subtitle}>
            Track and manage all your creative endeavors in one place
          </p>
        </div>

        <div className={styles.quickActions}>
          <Link href="/dashboard" className={styles.actionCard}>
            <div className={styles.actionIcon}>📊</div>
            <h3>View Dashboard</h3>
            <p>See your project statistics and progress</p>
          </Link>
          
          <Link href="/projects" className={styles.actionCard}>
            <div className={styles.actionIcon}>🧶</div>
            <h3>My Projects</h3>
            <p>Manage all your craft projects</p>
          </Link>
          
          <Link href="/projects/new" className={styles.actionCard}>
            <div className={styles.actionIcon}>✨</div>
            <h3>Start New Project</h3>
            <p>Begin a new creative journey</p>
          </Link>
        </div>

        {/* <div className={styles.recentProjects}>
          <h2>Recent Projects</h2>
          <div className={styles.projectGrid}>
            <div className={styles.projectCard}>
              <div className={styles.projectIcon}>🧶</div>
              <div className={styles.projectInfo}>
                <h4>Knitting Project</h4>
                <span className={styles.projectStatus}>In Progress</span>
              </div>
            </div>
          </div>
        </div> */}
      </main>
    </div>
  );
} 