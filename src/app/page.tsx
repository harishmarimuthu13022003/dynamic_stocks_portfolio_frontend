import Dashboard from '@/components/Dashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Dashboard />
      
      {/* Footer Info */}
      <footer className="mt-20 border-t border-border py-8 text-center text-gray-500 text-sm">
        <p>© 2026 Dynamic Portfolio Management System</p>
        <p className="mt-2">Data sourced from Yahoo Finance & Google Finance</p>
      </footer>
    </main>
  );
}
