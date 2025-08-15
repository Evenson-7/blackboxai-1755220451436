import { useState, useEffect } from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';

function EditRequestModal({ 
  show, 
  onClose, 
  entry, 
  onSubmit, 
  onCancelRequest 
}) {
  const [editRequest, setEditRequest] = useState({
    date: '',
    currentTimeIn: '',
    currentTimeOut: '',
    requestedTimeIn: '',
    requestedTimeOut: '',
    reason: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (entry) {
      setEditRequest({
        date: entry.date,
        currentTimeIn: entry.timeIn || 'Not recorded',
        currentTimeOut: entry.timeOut || 'Not recorded',
        requestedTimeIn: entry.timeIn || '',
        requestedTimeOut: entry.timeOut || '',
        reason: ''
      });
    }
  }, [entry]);

  const validate = () => {
    const newErrors = {};
    
    if (!editRequest.requestedTimeIn) {
      newErrors.requestedTimeIn = 'Time In is required';
    } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(editRequest.requestedTimeIn)) {
      newErrors.requestedTimeIn = 'Please enter a valid time (HH:MM)';
    }
    
    if (!editRequest.requestedTimeOut) {
      newErrors.requestedTimeOut = 'Time Out is required';
    } else if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(editRequest.requestedTimeOut)) {
      newErrors.requestedTimeOut = 'Please enter a valid time (HH:MM)';
    }
    
    if (editRequest.requestedTimeIn && editRequest.requestedTimeOut) {
      const timeIn = new Date(`2000-01-01T${editRequest.requestedTimeIn}`);
      const timeOut = new Date(`2000-01-01T${editRequest.requestedTimeOut}`);
      
      if (timeOut <= timeIn) {
        newErrors.requestedTimeOut = 'Time Out must be after Time In';
      }
    }
    
    if (!editRequest.reason) {
      newErrors.reason = 'Reason is required';
    } else if (editRequest.reason.length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(editRequest);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Request Timesheet Edit</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <div className="mt-1 p-2 bg-gray-100 rounded-md">{editRequest.date}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Time In</label>
                <div className="mt-1 p-2 bg-gray-100 rounded-md">{editRequest.currentTimeIn}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Time Out</label>
                <div className="mt-1 p-2 bg-gray-100 rounded-md">{editRequest.currentTimeOut}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Requested Time In*</label>
                <input
                  type="time"
                  value={editRequest.requestedTimeIn}
                  onChange={(e) => setEditRequest({...editRequest, requestedTimeIn: e.target.value})}
                  className={`mt-1 block w-full rounded-md ${errors.requestedTimeIn ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  required
                />
                {errors.requestedTimeIn && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FiAlertCircle className="mr-1" /> {errors.requestedTimeIn}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Requested Time Out*</label>
                <input
                  type="time"
                  value={editRequest.requestedTimeOut}
                  onChange={(e) => setEditRequest({...editRequest, requestedTimeOut: e.target.value})}
                  className={`mt-1 block w-full rounded-md ${errors.requestedTimeOut ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  required
                />
                {errors.requestedTimeOut && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FiAlertCircle className="mr-1" /> {errors.requestedTimeOut}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Reason for Edit*</label>
              <textarea
                rows={3}
                value={editRequest.reason}
                onChange={(e) => setEditRequest({...editRequest, reason: e.target.value})}
                className={`mt-1 block w-full rounded-md ${errors.reason ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                placeholder="Explain why you need this edit (minimum 10 characters)..."
                required
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <FiAlertCircle className="mr-1" /> {errors.reason}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Submit Request
          </button>
          {onCancelRequest && (
            <div className="flex flex-col items-end">
              <button
                type="button"
                onClick={() => onCancelRequest(editRequest)}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel Request
              </button>
              {entry?.existingReason && (
                <div className="mt-2 text-sm text-gray-600 max-w-xs text-right">
                  <p className="font-medium">Current reason:</p>
                  <p className="italic">{entry.existingReason}</p>
                </div>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditRequestModal;