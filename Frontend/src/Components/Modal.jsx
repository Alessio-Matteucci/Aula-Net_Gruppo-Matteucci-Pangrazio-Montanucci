import { motion, AnimatePresence } from 'framer-motion'

export function Modal({ open, title, children, onClose, footer }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="modalOverlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose?.()
          }}
        >
          <motion.div
            className="modal glass"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18 }}
          >
            <div className="modalHeader">
              <div className="modalTitle">{title}</div>
              <button className="btn" onClick={onClose}>
                Chiudi
              </button>
            </div>
            <div className="modalBody">{children}</div>
            {footer ? <div className="modalFooter">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

