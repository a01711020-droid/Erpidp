const logoIdp = "/logo-idp.svg";

export default function ModuleFooter() {
  return (
    <footer className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-t-4 border-slate-600 mt-12">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoIdp} alt="IDP" className="h-10 w-auto" />
            <div className="text-sm text-slate-300">
              <p className="font-semibold text-white">
                IDP Construcción, Consultoría y Diseño
              </p>
              <p>Sistema de Gestión Empresarial v1.0</p>
            </div>
          </div>
          <div className="text-sm text-slate-300">
            © 2025 Todos los derechos reservados
          </div>
        </div>
      </div>
    </footer>
  );
}
