export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col justify-center px-0 py-12 lg:px-8 sm:px-6">
      {children}
    </div>
  );
}
