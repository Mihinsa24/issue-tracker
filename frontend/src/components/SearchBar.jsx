function SearchBar({ search, setSearch, priority, setPriority, status, setStatus }) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <input
        type="text"
        placeholder="🔍 Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 min-w-[200px] px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-4 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All Statuses</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
        <option value="Closed">Closed</option>
      </select>
      {(search || priority || status) && (
        <button
          onClick={() => { setSearch(""); setPriority(""); setStatus(""); }}
          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg text-sm font-semibold cursor-pointer border-none"
        >
          Clear
        </button>
      )}
    </div>
  );
}

export default SearchBar;