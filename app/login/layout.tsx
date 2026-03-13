// Este layout sobrescreve o root layout para a rota /login
// Remove a Sidebar e qualquer wrapper do sistema
export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
