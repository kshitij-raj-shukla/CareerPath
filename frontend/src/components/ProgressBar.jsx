import { motion } from 'framer-motion';

export default function ProgressBar({ value = 0, label, color = 'from-indigo-500 to-purple-500', showPercent = true, size = 'md' }) {
  const clamped = Math.max(0, Math.min(100, value));
  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-end mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercent && (
            <span className="text-xl font-bold text-gray-900">
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${heightClass} rounded-full bg-gray-100 overflow-hidden`}>
        <motion.div
          className={`h-full rounded-full bg-linear-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  );
}
