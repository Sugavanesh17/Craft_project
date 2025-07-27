import RegisterForm from '../../components/RegisterForm';

export default function RegisterPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8f6ff 0%, #b4e0fe 100%)' }}>
      <RegisterForm />
    </div>
  );
}
