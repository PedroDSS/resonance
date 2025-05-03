import {
  RouterProvider,
  createRouter,
} from '@tanstack/react-router';
import { routeTree } from './routes';
import { AuthProvider } from './context/AuthContext';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-secondary text-light font-sans">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}
