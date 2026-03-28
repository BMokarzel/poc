import LogoImage from '../ui/LogoImage'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-[#0A0A1A] animate-fade-in">
      <div className="flex flex-col items-center gap-8">
        <LogoImage className="h-20" />

        <div className="text-center">
          <h1 className="font-display text-3xl font-normal tracking-tight text-navy dark:text-white">
            Trailblazer Team
          </h1>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500 font-body">
            Onboarding Project
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-slate-100 dark:bg-navy-mid rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-pulse-bar" />
        </div>
      </div>
    </div>
  )
}
