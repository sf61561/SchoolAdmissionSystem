import { useEffect, useState } from 'react'
import StudentLayout from '../../layouts/StudentLayout'
import { getStoredStudentId, resolveStudentId } from '../../utils/authStorage'
import MyHeldApplications from './MyHeldApplications'
import './Student.css'
import StudentClasses from './StudentClasses'
import StudentDashboard from './StudentDashboard'
import {
  DEFAULT_HOLD_DURATION_SECONDS,
  createInitialClasses,
  createInitialHolds,
  getEffectiveHoldStatus,
} from './studentUtils'

const TAB_META = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Overview of open classes, active holds, and confirmed seats.',
  },
  classes: {
    title: 'Classes',
    subtitle: 'Browse available class shifts and hold your admission seat.',
  },
  holds: {
    title: 'My Held Application',
    subtitle: 'Manage active holds, countdown timers, and admission fee payment.',
  },
}

function StudentPortal({
  user,
  isPreview,
  activeTab,
  onSelectTab,
  onLogout,
  onGoToLogin,
}) {
  const studentId =
    resolveStudentId(user, getStoredStudentId()) || '20152691234567891'

  const [nowMs, setNowMs] = useState(() => Date.now())
  const [classes, setClasses] = useState(() => createInitialClasses())
  const [holds, setHolds] = useState(() =>
    createInitialHolds(studentId, Date.now())
  )
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const tickNow = Date.now()
      setNowMs(tickNow)

      setHolds((prevHolds) => {
        const newlyExpiredClassIds = []
        let hasChanges = false

        const nextHolds = prevHolds.map((hold) => {
          if (
            hold.status === 'HELD' &&
            new Date(hold.expiresAt).getTime() <= tickNow
          ) {
            hasChanges = true
            newlyExpiredClassIds.push(hold.classId)
            return { ...hold, status: 'EXPIRED' }
          }
          return hold
        })

        if (hasChanges) {
          setClasses((prevClasses) =>
            prevClasses.map((cls) => {
              const expiredCount = newlyExpiredClassIds.filter(
                (id) => id === cls.id
              ).length
              if (expiredCount === 0) return cls
              const releaseCount = Math.min(cls.heldSeats, expiredCount)
              return {
                ...cls,
                heldSeats: cls.heldSeats - releaseCount,
                availableSeats: cls.availableSeats + releaseCount,
              }
            })
          )
        }

        return hasChanges ? nextHolds : prevHolds
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const activeHeldCount = holds.filter(
    (hold) => getEffectiveHoldStatus(hold, nowMs) === 'HELD'
  ).length

  const handleApplyForClass = (classId) => {
    const currentNow = Date.now()
    const targetClass = classes.find((cls) => cls.id === classId)

    if (!targetClass || targetClass.availableSeats <= 0) {
      setFeedback({
        type: 'error',
        message: 'No available seats remain in this class.',
      })
      return
    }

    const alreadyActive = holds.some((hold) => {
      if (hold.classId !== classId) return false
      const status = getEffectiveHoldStatus(hold, currentNow)
      return status === 'HELD' || status === 'CONFIRMED'
    })

    if (alreadyActive) {
      setFeedback({
        type: 'error',
        message: 'You already have an active or confirmed application for this class.',
      })
      return
    }

    const newHold = {
      holdId: `h_${String(currentNow).slice(-5)}`,
      classId: targetClass.id,
      className: targetClass.name,
      studentId,
      status: 'HELD',
      createdAt: new Date(currentNow).toISOString(),
      expiresAt: new Date(
        currentNow + DEFAULT_HOLD_DURATION_SECONDS * 1000
      ).toISOString(),
    }

    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === classId
          ? {
              ...cls,
              heldSeats: cls.heldSeats + 1,
              availableSeats: Math.max(0, cls.availableSeats - 1),
            }
          : cls
      )
    )
    setHolds((prev) => [newHold, ...prev])
    setFeedback({
      type: 'success',
      message: `Seat held for ${targetClass.name}. Complete fee payment before the hold timer expires.`,
    })
  }

  const handleConfirmHold = (holdId) => {
    const currentNow = Date.now()
    const targetHold = holds.find((hold) => hold.holdId === holdId)

    if (!targetHold) return

    const effectiveStatus = getEffectiveHoldStatus(targetHold, currentNow)
    if (effectiveStatus !== 'HELD') {
      setFeedback({
        type: 'error',
        message: 'Only an active, non-expired hold can be confirmed.',
      })
      return
    }

    setHolds((prev) =>
      prev.map((hold) =>
        hold.holdId === holdId ? { ...hold, status: 'CONFIRMED' } : hold
      )
    )
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === targetHold.classId
          ? {
              ...cls,
              heldSeats: Math.max(0, cls.heldSeats - 1),
              confirmedSeats: cls.confirmedSeats + 1,
            }
          : cls
      )
    )
    setFeedback({
      type: 'success',
      message: `Admission fee confirmed for ${targetHold.className}.`,
    })
  }

  const handleCancelHold = (holdId) => {
    const currentNow = Date.now()
    const targetHold = holds.find((hold) => hold.holdId === holdId)

    if (!targetHold) return
    if (getEffectiveHoldStatus(targetHold, currentNow) !== 'HELD') return

    setHolds((prev) =>
      prev.map((hold) =>
        hold.holdId === holdId ? { ...hold, status: 'CANCELLED' } : hold
      )
    )
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === targetHold.classId
          ? {
              ...cls,
              heldSeats: Math.max(0, cls.heldSeats - 1),
              availableSeats: cls.availableSeats + 1,
            }
          : cls
      )
    )
    setFeedback({
      type: 'info',
      message: `Cancelled hold for ${targetHold.className}. The seat has been released.`,
    })
  }

  const meta = TAB_META[activeTab] || TAB_META.dashboard

  return (
    <StudentLayout
      activeTab={activeTab}
      onSelectTab={(tab) => {
        setFeedback(null)
        onSelectTab(tab)
      }}
      pageTitle={meta.title}
      pageSubtitle={meta.subtitle}
      user={user}
      isPreview={isPreview}
      heldCount={activeHeldCount}
      onLogout={onLogout}
      onGoToLogin={onGoToLogin}
    >
      {feedback && (
        <div
          className={`student-alert student-alert--${feedback.type}`}
          role={feedback.type === 'error' ? 'alert' : 'status'}
          style={{ marginBottom: '1.25rem' }}
        >
          <span className="student-alert-body">{feedback.message}</span>
          <button
            type="button"
            className="student-alert-close"
            onClick={() => setFeedback(null)}
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      )}

      {activeTab === 'classes' && (
        <StudentClasses
          classes={classes}
          holds={holds}
          nowMs={nowMs}
          onApplyForClass={handleApplyForClass}
          onGoToHolds={() => onSelectTab('holds')}
        />
      )}

      {activeTab === 'holds' && (
        <MyHeldApplications
          holds={holds}
          nowMs={nowMs}
          onConfirmHold={handleConfirmHold}
          onCancelHold={handleCancelHold}
          onBrowseClasses={() => onSelectTab('classes')}
        />
      )}

      {activeTab === 'dashboard' && (
        <StudentDashboard
          user={user}
          classes={classes}
          holds={holds}
          nowMs={nowMs}
          onNavigate={onSelectTab}
          onConfirmHold={handleConfirmHold}
          onCancelHold={handleCancelHold}
        />
      )}
    </StudentLayout>
  )
}

export default StudentPortal
