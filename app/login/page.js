import LoginForm from '../../components/LoginForm';

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8f6ff 0%, #b4e0fe 100%)' }}>
      <LoginForm />
    </div>
  );
}
