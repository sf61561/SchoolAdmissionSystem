import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import StudentPortal from '../pages/student/StudentPortal'

const PREVIEW_STUDENT_USER = {
  id: '20152691234567891',
  fullName: 'Syed Fahad',
  email: 'student@schooladmission.local',
  role: 1,
}

const STUDENT_TAB_PATHS = {
  dashboard: '/student/dashboard',
  classes: '/student/classes',
  holds: '/student/my-held-application',
}

function getStudentTabPath(tab) {
  return STUDENT_TAB_PATHS[tab] || STUDENT_TAB_PATHS.dashboard
}

/**
 * Renders StudentPortal with authenticated or preview student info, tab routing, and logout.
 */
function StudentPortalRoute({ activeTab }) {
  const navigate = useNavigate()
  const { currentUser, storedStudentId, logout } = useAuth()

  const isPreview = !currentUser && !storedStudentId
  const studentUser = currentUser || {
    ...PREVIEW_STUDENT_USER,
    id: storedStudentId || PREVIEW_STUDENT_USER.id,
  }

  const handleSelectTab = (nextTab) => {
    navigate(getStudentTabPath(nextTab))
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <StudentPortal
      user={studentUser}
      isPreview={isPreview}
      activeTab={activeTab}
      onSelectTab={handleSelectTab}
      onLogout={handleLogout}
      onGoToLogin={() => navigate('/login')}
    />
  )
}

export default StudentPortalRoute
