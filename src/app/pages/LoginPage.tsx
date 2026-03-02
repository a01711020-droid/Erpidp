/**
 * LOGIN PAGE
 *
 * Pantalla de autenticación del ERP.
 * - En MOCK_MODE muestra credenciales de prueba
 * - En producción conecta al endpoint POST /auth/login del backend
 */

import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { MOCK_MODE } from '@/core/config';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login, getRedirectPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Si venía de una ruta protegida, regresar ahí después del login
  const from = (location.state as { from?: string })?.from || null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await login(email.trim(), password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Error al iniciar sesión');
      return;
    }

    // Obtener user del localStorage para saber a dónde redirigir
    const userRaw = localStorage.getItem('erp_user');
    if (userRaw) {
      const user = JSON.parse(userRaw);
      const destination = from || getRedirectPath(user.rol);
      navigate(destination, { replace: true });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)'
    }}>
      <div className="w-full max-w-md px-4">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-10 text-center">
            <img
              src="/logo-idp-normal.svg"
              alt="IDP Construcción"
              className="h-16 w-auto mx-auto mb-4"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <h1 className="text-2xl font-bold text-white">Sistema ERP</h1>
            <p className="text-slate-300 text-sm mt-1">IDP Construcción, Consultoría y Diseño</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Iniciar Sesión</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@idp.mx"
                    required
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-400 text-white font-medium py-2.5 px-4 rounded-lg transition text-sm mt-2"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Ingresando...</>
                ) : (
                  'Ingresar al sistema'
                )}
              </button>
            </form>

            {/* Credenciales de prueba en modo mock */}
            {MOCK_MODE && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-semibold text-amber-800 mb-2">🧪 Modo desarrollo — credenciales de prueba:</p>
                <div className="space-y-1 text-xs text-amber-700 font-mono">
                  <div className="grid grid-cols-2 gap-x-2">
                    <span>admin@idp.mx</span><span>admin123</span>
                    <span>director@idp.mx</span><span>director123</span>
                    <span>compras@idp.mx</span><span>compras123</span>
                    <span>residente@idp.mx</span><span>residente123</span>
                    <span>finanzas@idp.mx</span><span>finanzas123</span>
                    <span>almacen@idp.mx</span><span>almacen123</span>
                    <span>rh@idp.mx</span><span>rh123</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-4">
          © 2025 IDP Construcción — Sistema de Gestión Empresarial
        </p>
      </div>
    </div>
  );
}
