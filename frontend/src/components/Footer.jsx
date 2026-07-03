import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>© 2026 FraudShield Store — Real-Time Fraud Detection Demo</p>
        <div className="flex gap-4">
          <Link to="/help" className="hover:text-brand-600">
            Help Center
          </Link>
          <Link to="/admin/login" className="hover:text-brand-600">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
