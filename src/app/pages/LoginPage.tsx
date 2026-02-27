/**
 * LOGIN PAGE
 * Pantalla de acceso al sistema. Autentica y redirige por rol.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth, ROLE_HOME } from "../contexts/AuthContext";
import { Building2, Lock, Mail, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading, error, user, clearError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Si ya está autenticado, redirigir a su módulo
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(ROLE_HOME[user.rol], { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(email, password);
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4"
      style={{
        background: "linear-gradient(to bottom right, #1e293b 0%, #334155 50%, #1e293b 100%)",
      }}
    >
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-10 text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/logo-idp-normal.svg"
              alt="IDP Construcción"
              className="h-16 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          <h1
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Sistema de Gestión Empresarial
          </h1>
          <p
            className="text-slate-300 text-sm mt-1"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            IDP Construcción, Consultoría y Diseño
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">
            Iniciar Sesión
          </h2>

          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@idpconstruccion.com"
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
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-400 text-white font-semibold py-2.5 rounded-lg transition mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Building2 className="h-4 w-4" />
                  Entrar al Sistema
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            ¿Problemas para acceder? Contacta al administrador del sistema.
          </p>
        </div>
      </div>

      <p className="text-slate-500 text-xs mt-6">
        © 2025 IDP Construcción · Todos los derechos reservados
      </p>
    </div>
  );
}
