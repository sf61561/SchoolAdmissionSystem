import { useEffect, useState } from 'react'
import { validateNewClassInput } from './adminUtils'

/**
 * Modal dialog for adding a new class shift with seat capacity.
 */
function AddClassModal({ isOpen, existingClasses, onClose, onCreateClass }) {
  const [name, setName] = useState('')
  const [totalSeats, setTotalSeats] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const validationErrors = validateNewClassInput(
      { name, totalSeats },
      existingClasses
    )

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    onCreateClass({ name, totalSeats: Number(totalSeats) })
  }

  return (
    <div
      className="admin-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="admin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-class-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <h2 id="add-class-modal-title" className="admin-modal-title">
            Add Class
          </h2>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <form className="admin-modal-form" onSubmit={handleSubmit} noValidate>
          <div className="admin-field">
            <label htmlFor="admin-class-name" className="admin-label">
              Class Name
            </label>
            <input
              id="admin-class-name"
              type="text"
              className={`admin-input ${errors.name ? 'admin-input--error' : ''}`}
              placeholder="e.g. Class 9 - Morning Shift"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: undefined }))
                }
              }}
              autoFocus
            />
            {errors.name && (
              <p className="admin-field-error" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="admin-field">
            <label htmlFor="admin-total-seats" className="admin-label">
              Total Seats
            </label>
            <input
              id="admin-total-seats"
              type="number"
              min="1"
              max="1000"
              step="1"
              className={`admin-input ${errors.totalSeats ? 'admin-input--error' : ''}`}
              placeholder="e.g. 40"
              value={totalSeats}
              onChange={(event) => {
                setTotalSeats(event.target.value)
                if (errors.totalSeats) {
                  setErrors((prev) => ({ ...prev, totalSeats: undefined }))
                }
              }}
            />
            {errors.totalSeats && (
              <p className="admin-field-error" role="alert">
                {errors.totalSeats}
              </p>
            )}
          </div>

          <div className="admin-modal-actions">
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary">
              Create Class
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddClassModal
