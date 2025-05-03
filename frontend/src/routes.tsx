import {
    createRootRoute,
    createRoute,
    Outlet,
} from '@tanstack/react-router';

import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';

const rootRoute = createRootRoute({
    component: () => (
        <div>
            <Outlet />
        </div>
    ),
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Chat,
});

const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: Login,
});

const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/register',
    component: Register,
});

const chatRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/chat',
    component: Chat,
});

export const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    registerRoute,
    chatRoute,
]);
