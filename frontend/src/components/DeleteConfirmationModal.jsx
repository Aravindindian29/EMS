import { AlertTriangle, X, User, Trash2 } from 'lucide-react';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  employeeName, 
  employeeId,
  isDeleting 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glossy-card p-8 max-w-lg w-full mx-auto border-2 border-red-500/40 shadow-2xl shadow-red-500/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-red-500/20 to-red-600/30 rounded-xl border border-red-500/30">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Delete Employee</h2>
              <p className="text-gray-400 text-sm">Permanent action</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-ironman-red/20 rounded-lg transition-all duration-200"
            disabled={isDeleting}
          >
            <X className="w-5 h-5 text-ironman-gold" />
          </button>
        </div>

        {/* Employee Info Card */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-ironman-dark/60 to-ironman-dark/40 border border-ironman-red/30 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-ironman-gold/20 rounded-lg border border-ironman-gold/30">
                <User className="w-6 h-6 text-ironman-gold" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-ironman-gold font-semibold mb-1 uppercase tracking-wider">Employee Details</p>
                <p className="text-white font-bold text-lg mb-1">{employeeName}</p>
                <p className="text-ironman-gold font-mono text-sm">ID: {employeeId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-300 font-semibold mb-2">Warning: Irreversible Action</p>
              <p className="text-red-400/90 text-sm leading-relaxed">
                This will permanently delete all employee data including personal information, 
                work history, and associated records. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation Question */}
        <div className="mb-8 text-center">
          <p className="text-gray-300 text-lg font-medium">
            Are you sure you want to delete this employee?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-3 bg-ironman-gold border border-ironman-gold text-black font-semibold rounded-xl hover:bg-yellow-400 hover:border-yellow-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 border border-red-400/50 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="loading-spinner w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Employee
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
