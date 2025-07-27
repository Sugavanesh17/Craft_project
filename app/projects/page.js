'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProjectList from '../../components/ProjectList';
import styles from '../../styles/ProjectsPage.module.css';

export default function ProjectsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [viewMode, setViewMode] = useState('grid');
  const statsRef = useRef();
  const listRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Decode JWT token to get user info
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    } catch (error) {
      console.error('Error decoding token:', error);
      router.push('/login');
    }
  }, [router]);

  const handleProjectAdded = () => {
    if (statsRef.current) statsRef.current.refresh();
    if (listRef.current) listRef.current.refresh();
  };

  const handleProjectUpdated = () => {
    if (statsRef.current) statsRef.current.refresh();
    if (listRef.current) listRef.current.refresh();
  };

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
          <Link href="/projects" className={`${styles.navLink} ${styles.active}`}>Projects</Link>
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
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Your Craft Projects</h1>
          <p className={styles.subtitle}>Track and manage all your creative endeavors in one place</p>
        </div>

        {/* Search and Filter Bar */}
        <div className={styles.searchFilterBar}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search projects, materials, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filters}>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option>All Categories</option>
              <option>Knitting</option>
              <option>Crochet</option>
              <option>Sewing</option>
              <option>Embroidery</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option>All Statuses</option>
              <option>Planned</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <span className={styles.gridIcon}>⊞</span>
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
            >
              <span className={styles.listIcon}>☰</span>
            </button>
          </div>
        </div>

        {/* Project Content */}
        <div className={styles.projectContent}>
          <ProjectList 
            ref={listRef} 
            onProjectUpdated={handleProjectUpdated}
            searchTerm={searchTerm}
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            viewMode={viewMode}
          />
      </div>
      </main>
    </div>
  );
} 