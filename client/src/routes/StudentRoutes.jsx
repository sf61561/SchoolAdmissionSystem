import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/routes/ProtectedRoute'
import StudentPortalRoute from './StudentPortalRoute'

/**
 * Nested student portal routes supporting dashboard, classes, and held applications.
 */
function StudentRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRole="student" allowGuestPreview />}>
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route
          path="dashboard"
          element={<StudentPortalRoute activeTab="dashboard" />}
        />
        <Route
          path="classes"
          element={<StudentPortalRoute activeTab="classes" />}
        />
        <Route
          path="my-held-application"
          element={<StudentPortalRoute activeTab="holds" />}
        />
        <Route
          path="holds"
          element={<Navigate to="/student/my-held-application" replace />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default StudentRoutes
