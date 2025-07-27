'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../styles/LoginForm.module.css';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      router.push('/home');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <div className={styles.header}>
        <span className={styles.emoji}>🧩</span>
        <h1 className={styles.title}>Craft Tracker</h1>
        <p className={styles.subtitle}>Welcome back!</p>
      </div>
      <div>
        <label className={styles.label}>Email Address</label>
        <input
          type="email"
          className={styles.input}
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className={styles.label}>Password</label>
        <input
          type="password"
          className={styles.input}
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <button
        type="submit"
        className={styles.button}
        disabled={loading}
      >
        <span role="img" aria-label="sparkles">✨</span> {loading ? 'Signing In...' : 'Sign In'}
      </button>
      <div className={styles.link}>
        <Link href="/register">Don't have an account? Sign up</Link>
      </div>
    </form>
  );
}
