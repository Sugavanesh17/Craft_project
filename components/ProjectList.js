'use client';
import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import Link from 'next/link';
import styles from '../styles/ProjectList.module.css';

const statusBadgeClass = {
  'Planned': styles.badge,
  'In Progress': styles.badge + ' ' + styles.inprogress,
  'Completed': styles.badge + ' ' + styles.completed,
};

const statusOptions = ['Planned', 'In Progress', 'Completed'];

const ProjectList = forwardRef(({ onProjectUpdated, searchTerm, categoryFilter, statusFilter, viewMode }, ref) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch projects');
      setProjects(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchProjects
  }));

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      fetchProjects();
      if (onProjectUpdated) onProjectUpdated();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchProjects();
      if (onProjectUpdated) onProjectUpdated();
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter projects based on search term and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchTerm || 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All Statuses' || project.status === statusFilter;
    
    // For now, we'll assume all projects are in the "Craft" category
    const matchesCategory = categoryFilter === 'All Categories' || categoryFilter === 'Craft';
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) return <div className={styles.loading}>Loading projects...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  if (viewMode === 'grid') {
    return (
      <div className={styles.gridList}>
        {filteredProjects.length === 0 && <div className={styles.empty}>No projects found.</div>}
        {filteredProjects.map(project => (
          <Link href={`/projects/${project._id}`} key={project._id} className={styles.gridCard}>
            <div className={styles.gridCardContent}>
              <div className={styles.gridCardIcon}>🧶</div>
              <div className={styles.gridCardInfo}>
                <h3 className={styles.gridCardName}>{project.name}</h3>
                <span className={`${styles.gridCardStatus} ${statusBadgeClass[project.status]}`}>
                  {project.status}
                </span>
              </div>
              <div className={styles.gridCardDetails}>
                <span className={styles.gridCardId}>#{project._id.slice(-6)}</span>
                <div className={styles.gridCardMeta}>
                  <span className={styles.gridCardMaterials}>0 materials</span>
                  <span className={styles.gridCardDeadline}>
                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {filteredProjects.length === 0 && <div className={styles.empty}>No projects found.</div>}
      {filteredProjects.map(project => (
        <div className={styles.card} key={project._id}>
          <div className={styles.header}>
            <span className={styles.name}>{project.name}</span>
            <span className={statusBadgeClass[project.status]}>{project.status}</span>
          </div>
          <div className={styles.desc}>{project.description}</div>
          <div className={styles.footer}>
            <span className={styles.deadline}>Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</span>
            <button className={styles.delete} onClick={() => handleDelete(project._id)}>Delete</button>
          </div>
          <div className={styles.statusUpdateRow}>
            <label htmlFor={`status-${project._id}`}>Update Status:</label>
            <select
              id={`status-${project._id}`}
              value={project.status}
              onChange={e => handleStatusChange(project._id, e.target.value)}
              className={styles.statusSelect}
            >
              {statusOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
});

ProjectList.displayName = 'ProjectList';

export default ProjectList; 