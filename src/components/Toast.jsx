import { AnimatePresence, motion } from 'motion/react';

/**
 * Renders the active toast stack in the bottom-right corner.
 * Expects the `toasts` array from `useToast`.
 *
 * @param {{ toasts: Array<{ id: number, message: string, type: string }> }} props
 */
export default function Toast({ toasts }) {
  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className="toast-item"
            data-type={t.type ?? 'info'}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
