function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <p className="text-center text-slate-800 font-medium mb-5">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-semibold text-sm cursor-pointer border-none"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm cursor-pointer border-none"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;