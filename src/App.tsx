import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Home } from './components/Home';
import { Auth } from './components/auth/Auth';
import { CalendarView } from './features/schedule/components/CalendarView';
import { useAuth } from './store/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './store/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false
    }
  }
});

// Dashboard component to handle redirection based on authentication status
function Dashboard() {
  const { auth } = useAuth();
  if (auth.isAuthenticated) {
    return <Navigate to="/schedule" replace />;
  }
  return <Home />;
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/schedule" element={<PrivateRoute><CalendarView /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default App;
