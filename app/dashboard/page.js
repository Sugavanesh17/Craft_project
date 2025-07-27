'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../styles/DashboardPage.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    planned: 0,
    inProgress: 0,
    completed: 0,
    recentProjects: []
  });
  const [loading, setLoading] = useState(true);

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
      fetchDashboardData(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      router.push('/login');
    }
  }, [router]);

  const fetchDashboardData = async (token) => {
    try {
      const res = await fetch('/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const projects = await res.json();
      
      if (!res.ok) throw new Error('Failed to fetch projects');
      
      const stats = {
        total: projects.length,
        planned: projects.filter(p => p.status === 'Planned').length,
        inProgress: projects.filter(p => p.status === 'In Progress').length,
        completed: projects.filter(p => p.status === 'Completed').length,
        recentProjects: projects.slice(0, 5) // Get 5 most recent projects
      };
      
      setStats(stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  if (!user) {
    return null;
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
          <Link href="/dashboard" className={`${styles.navLink} ${styles.active}`}>Dashboard</Link>
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
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Overview of your craft projects</p>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📊</div>
            <div className={styles.statContent}>
              <h3>Total Projects</h3>
              <div className={styles.statNumber}>{stats.total}</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📝</div>
            <div className={styles.statContent}>
              <h3>Planned</h3>
              <div className={styles.statNumber}>{stats.planned}</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🔄</div>
            <div className={styles.statContent}>
              <h3>In Progress</h3>
              <div className={styles.statNumber}>{stats.inProgress}</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statContent}>
              <h3>Completed</h3>
              <div className={styles.statNumber}>{stats.completed}</div>
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className={styles.progressSection}>
          <h2>Project Progress</h2>
          <div className={styles.progressChart}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
            <div className={styles.progressStats}>
              <span>{stats.completed} of {stats.total} projects completed</span>
              <span>{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</span>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className={styles.recentSection}>
          <div className={styles.sectionHeader}>
            <h2>Recent Projects</h2>
            <Link href="/projects" className={styles.viewAllBtn}>View All</Link>
          </div>
          <div className={styles.recentGrid}>
            {stats.recentProjects.length > 0 ? (
              stats.recentProjects.map(project => (
                <Link href={`/projects/${project._id}`} key={project._id} className={styles.recentCard}>
                  <div className={styles.projectIcon}>🧶</div>
                  <div className={styles.projectInfo}>
                    <h4>{project.name}</h4>
                    <span className={`${styles.statusBadge} ${styles[project.status.toLowerCase().replace(' ', '')]}`}>
                      {project.status}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🧶</div>
                <h3>No projects yet</h3>
                <p>Start your first craft project to see it here</p>
                <Link href="/projects/new" className={styles.startProjectBtn}>
                  Start New Project
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <div className={styles.actionGrid}>
            <Link href="/projects/new" className={styles.actionCard}>
              <div className={styles.actionIcon}>✨</div>
              <h3>Create New Project</h3>
              <p>Start a new craft project</p>
            </Link>
            
            <Link href="/projects" className={styles.actionCard}>
              <div className={styles.actionIcon}>📋</div>
              <h3>View All Projects</h3>
              <p>Manage your existing projects</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 