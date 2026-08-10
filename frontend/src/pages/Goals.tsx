export default function Goals() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Goals</h1>
      <div className="glass-panel p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🎯</span>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">No goals yet.</h2>
        <p className="text-textMuted mb-6 max-w-sm">Set your first objective and let AI-OS help you track and achieve it.</p>
        <button className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
          Create Goal
        </button>
      </div>
    </div>
  );
}
