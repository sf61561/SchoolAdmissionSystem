import { useState } from 'react'
import StudentLayout from '../../layouts/StudentLayout'
import AddClassModal from './AddClassModal'
import AdminClasses from './AdminClasses'
import AdminDashboard from './AdminDashboard'
import AdminStudents from './AdminStudents'
import {
  createClassRecord,
  createInitialAdminClasses,
  createInitialAdminStudents,
} from './adminUtils'
import './Admin.css'

const ADMIN_NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'classes',
    label: 'Classes',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        <path d="M8 7h8" />
        <path d="M8 11h6" />
      </svg>
    ),
  },
  {
    id: 'students',
    label: 'Students',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
]

/**
 * Admin Portal shell coordinating Dashboard, Classes, Students, and Add Class modal.
 */
function AdminPortal({ activeTab = 'dashboard', onSelectTab, onLogout }) {
  const [classes, setClasses] = useState(() => createInitialAdminClasses())
  const [students] = useState(() => createInitialAdminStudents())
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [dashboardNotice, setDashboardNotice] = useState('')

  const handleOpenAddClass = () => {
    setIsAddModalOpen(true)
  }

  const handleCloseAddClass = () => {
    setIsAddModalOpen(false)
  }

  const handleCreateClass = ({ name, totalSeats }) => {
    const newClass = createClassRecord({ name, totalSeats }, classes)
    setClasses((prev) => [...prev, newClass])
    setIsAddModalOpen(false)
    setDashboardNotice(
      `Added "${newClass.name}" with ${newClass.totalSeats} total seats.`
    )
  }

  return (
    <StudentLayout
      activeTab={activeTab}
      onSelectTab={onSelectTab}
      pageTitle="School Admission System"
      titleOnly={true}
      navItems={ADMIN_NAV_ITEMS}
      brandTitle="School Admission"
      brandSubtitle="Admin Panel"
      onLogout={onLogout}
    >
      {activeTab === 'dashboard' && (
        <AdminDashboard
          onOpenAddClass={handleOpenAddClass}
          notice={dashboardNotice}
          onDismissNotice={() => setDashboardNotice('')}
        />
      )}

      {activeTab === 'classes' && (
        <AdminClasses
          classes={classes}
          onOpenAddClass={handleOpenAddClass}
        />
      )}

      {activeTab === 'students' && <AdminStudents students={students} />}

      {isAddModalOpen && (
        <AddClassModal
          isOpen={isAddModalOpen}
          existingClasses={classes}
          onClose={handleCloseAddClass}
          onCreateClass={handleCreateClass}
        />
      )}
    </StudentLayout>
  )
}

export default AdminPortal
