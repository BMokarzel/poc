export default function EmptyState({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <span className="text-2xl">📭</span>
      </div>
      <h3 className="font-display text-lg text-navy dark:text-white">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500 max-w-sm">{description}</p>
      )}
    </div>
  )
}
