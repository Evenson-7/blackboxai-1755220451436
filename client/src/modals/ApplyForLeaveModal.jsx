import { useState } from 'react';
import { FiX, FiCalendar, FiClock, FiInfo, FiFileText } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ApplyForLeaveModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    isHalfDay: false,
    halfDayType: 'first',
    contactInfo: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.leaveType) {
      newErrors.leaveType = 'Leave type is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else if (isNaN(new Date(formData.startDate).getTime())) {
      newErrors.startDate = 'Invalid start date';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (isNaN(new Date(formData.endDate).getTime())) {
      newErrors.endDate = 'Invalid end date';
    }
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    }
    if (formData.isHalfDay && !formData.halfDayType) {
      newErrors.halfDayType = 'Half day type is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      const formattedData = {
        ...formData,
        from: formatDateForDisplay(formData.startDate),
        to: formatDateForDisplay(formData.endDate),
        appliedOn: formatDateForDisplay(new Date().toISOString()),
        duration: calculateDuration(formData.startDate, formData.endDate, formData.isHalfDay)
      };
      // Call onSubmit and let LeaveManagement handle the success toast
      onSubmit(formattedData);
      // Close modal with wasSubmitted: true to prevent "cancelled" toast
      onClose({ wasSubmitted: true });
    } catch (error) {
      // Show error toast and keep modal open for corrections
      toast.error(`Failed to submit leave request: ${error.message}`);
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const calculateDuration = (startDate, endDate, isHalfDay) => {
    if (!startDate || !endDate) return '';
    
    if (isHalfDay) return '0.5 day';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return diffDays === 1 ? '1 day' : `${diffDays} days`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FiFileText className="text-blue-500" />
            Apply for Leave
          </h3>
          <button 
            onClick={() => onClose({ wasSubmitted: false })}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-1">
              Leave Type <span className="text-red-500">*</span>
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className={`w-full border ${errors.leaveType ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
              aria-invalid={!!errors.leaveType}
              aria-describedby={errors.leaveType ? 'leaveType-error' : undefined}
            >
              <option value="">Select leave type</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Personal Leave">Personal Leave</option>
              <option value="Academic Leave">Academic Leave</option>
              <option value="Bereavement Leave">Bereavement Leave</option>
            </select>
            {errors.leaveType && (
              <p id="leaveType-error" className="mt-1 text-sm text-red-500">{errors.leaveType}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FiCalendar className="text-blue-500" />
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  aria-invalid={!!errors.startDate}
                  aria-describedby={errors.startDate ? 'startDate-error' : undefined}
                />
                <FiCalendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
              </div>
              {errors.startDate && (
                <p id="startDate-error" className="mt-1 text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>
            
            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FiCalendar className="text-blue-500" />
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  disabled={!formData.startDate}
                  aria-invalid={!!errors.endDate}
                  aria-describedby={errors.endDate ? 'endDate-error' : undefined}
                />
                <FiCalendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
              </div>
              {errors.endDate && (
                <p id="endDate-error" className="mt-1 text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isHalfDay"
                checked={formData.isHalfDay}
                onChange={handleChange}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Half Day Leave</span>
            </label>
            
            {formData.isHalfDay && (
              <div className="mt-2 ml-6">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="halfDayType"
                      value="first"
                      checked={formData.halfDayType === 'first'}
                      onChange={handleChange}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">First Half</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="halfDayType"
                      value="second"
                      checked={formData.halfDayType === 'second'}
                      onChange={handleChange}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Second Half</span>
                  </label>
                </div>
                {errors.halfDayType && (
                  <p className="mt-1 text-sm text-red-500">{errors.halfDayType}</p>
                )}
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <FiInfo className="mr-1" />
                  <span>First half: 9AM-1PM, Second half: 1PM-5PM</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className=" text-sm font-medium text-gray-700 mb-1">
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={3}
              className={`w-full border ${errors.reason ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Briefly explain the reason for your leave"
              required
              aria-invalid={!!errors.reason}
              aria-describedby={errors.reason ? 'reason-error' : undefined}
            />
            {errors.reason && (
              <p id="reason-error" className="mt-1 text-sm text-red-500">{errors.reason}</p>
            )}
          </div>

          <div>
            <label className=" text-sm font-medium text-gray-700 mb-1">
              Contact Information During Leave
            </label>
            <input
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phone number or email where you can be reached"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => onClose({ wasSubmitted: false })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyForLeaveModal;