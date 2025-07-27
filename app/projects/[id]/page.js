'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../../../styles/ProjectDetailPage.module.css';

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      fetchProjectDetails(token, params.id);
    } catch (error) {
      console.error('Error decoding token:', error);
      router.push('/login');
    }
  }, [router, params.id]);

  const fetchProjectDetails = async (token, projectId) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          setError('Project not found');
        } else {
          setError('Failed to fetch project details');
        }
        setLoading(false);
        return;
      }
      
      const projectData = await res.json();
      setProject(projectData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project details:', error);
      setError('Failed to fetch project details');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/projects/${params.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Failed to delete project');
      }

      router.push('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/projects/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update project status');
      }

      const updatedProject = await res.json();
      setProject(updatedProject);
    } catch (error) {
      console.error('Error updating project status:', error);
      setError('Failed to update project status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return <div className={styles.loading}>Loading project details...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>{error}</div>
        <Link href="/projects" className={styles.backBtn}>Back to Projects</Link>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/projects" className={styles.backLink}>
            <span className={styles.backIcon}>←</span>
            Back to Projects
          </Link>
        </div>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🧩</span>
          <span className={styles.logoText}>CraftTracker</span>
        </div>
        <div className={styles.headerRight}>
          <button onClick={handleDelete} className={styles.deleteBtn}>
            <span className={styles.deleteIcon}>🗑️</span>
            Delete
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.projectLayout}>
          {/* Left Column - Project Overview */}
          <div className={styles.leftColumn}>
            <div className={styles.projectOverview}>
              <div className={styles.projectIcon}>🧶</div>
              <div className={styles.projectId}>#{project._id.slice(-6)}</div>
              <h1 className={styles.projectName}>{project.name}</h1>
            </div>

            <div className={styles.projectVisual}>
              <div className={styles.visualPlaceholder}>
                <div className={styles.placeholderIcon}>🧶</div>
              </div>
            </div>

            <div className={styles.description}>
              <h2>Description</h2>
              <p>
                {project.description || 'No description available for this project.'}
              </p>
            </div>
          </div>

          {/* Right Column - Project Info */}
          <div className={styles.rightColumn}>
            <div className={styles.statusSection}>
              <label htmlFor="status-select">Project Status:</label>
              <select
                id="status-select"
                value={project.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={styles.statusSelect}
              >
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className={styles.projectInfo}>
              <h2>Project Info</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📅</span>
                  <div className={styles.infoContent}>
                    <label>Created</label>
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>🕒</span>
                  <div className={styles.infoContent}>
                    <label>Last Updated</label>
                    <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📦</span>
                  <div className={styles.infoContent}>
                    <label>Category</label>
                    <span>Craft</span>
                  </div>
                </div>
                
                {project.deadline && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>🎯</span>
                    <div className={styles.infoContent}>
                      <label>Deadline</label>
                      <span>{new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.actions}>
              <Link href={`/projects/${params.id}/edit`} className={styles.editBtn}>
                <span className={styles.editIcon}>✏️</span>
                Edit Project
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 