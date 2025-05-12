import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import DashboardLayout from '../layouts/DashboardLayout';
import ProjectsPage from '../pages/ProjectPage';
import TasksPage from '../pages/TasksPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import AdminProjectPage from '../pages/AdminProjectPage';
import AdminTaskPage from '../pages/AdminTaskPage';

const AppRoutes = () => {
  const role = localStorage.getItem('role'); // Make sure this is set on login
  const isAdmin = localStorage.getItem('role') === 'ADMIN';

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route path="/" element={<DashboardLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="tasks" element={<TasksPage />} />

        {/* Admin-only routes */}
        {role === 'ADMIN' && (
          <>
            <Route path="/admin/users" element={isAdmin ? <AdminUsersPage /> : <Navigate to="/dashboard" />} />
            <Route path="/admin/projects" element={isAdmin ? <AdminProjectPage /> : <Navigate to="/dashboard" />} />
            <Route path="/admin/tasks" element={isAdmin ? <AdminTaskPage /> : <Navigate to="/dashboard" />} />
          </>
        )}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;
