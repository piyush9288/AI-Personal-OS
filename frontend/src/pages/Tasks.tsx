export default function Tasks() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Tasks</h1>
      <div className="glass-panel p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">✓</span>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Your task list is clear.</h2>
        <p className="text-textMuted mb-6 max-w-sm">Break down your goals into actionable tasks.</p>
        <button className="px-6 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors">
          Create Task
        </button>
      </div>
    </div>
  );
}
