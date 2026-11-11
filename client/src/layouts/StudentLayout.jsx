import { useState } from 'react'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/dashboard/Sidebar'
import './StudentLayout.css'

function StudentLayout({
  activeTab,
  onSelectTab,
  pageTitle,
  pageSubtitle,
  titleOnly = false,
  navItems,
  brandTitle,
  brandSubtitle,
  user,
  isPreview,
  heldCount,
  onLogout,
  onGoToLogin,
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="student-shell">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onLogout={onLogout}
        navItems={navItems}
        brandTitle={brandTitle}
        brandSubtitle={brandSubtitle}
        heldCount={heldCount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="student-main-column">
        <Navbar
          title={pageTitle}
          subtitle={pageSubtitle}
          titleOnly={titleOnly}
          user={user}
          isPreview={isPreview}
          onMenuClick={() => setSidebarOpen(true)}
          onGoToLogin={onGoToLogin}
        />

        <main className="student-content">{children}</main>
      </div>
    </div>
  )
}

export default StudentLayout
