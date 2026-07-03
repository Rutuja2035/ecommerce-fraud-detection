import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('customer@demo.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      navigate(data.role === 'admin' ? '/admin/fraud' : '/');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4">
      <form onSubmit={handleSubmit} className="card space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-sm text-slate-500">Demo: customer@demo.com / demo123</p>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full">Login</button>
        <p className="text-center text-sm">
          No account? <Link to="/register" className="text-brand-600">Register</Link>
        </p>
      </form>
    </div>
  );
}
