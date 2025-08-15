import { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiClock, FiList, FiFileText, FiCheckCircle, FiMessageSquare } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const NewReportModal = ({ isOpen, onClose, onSubmit, tasks = [], reportToEdit = null, reportToView = null }) => {
  const [formData, setFormData] = useState({
    date: '',
    hoursWorked: '',
    selectedTasks: [],
    summary: '',
    challenges: '',
    plans: ''
  });

  const [errors, setErrors] = useState({});
  const [isViewMode, setIsViewMode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (reportToView) {
        console.log('NewReportModal: reportToView=', reportToView); // Debug log
        console.log('NewReportModal: feedback=', reportToView?.feedback); // Debug log
        setFormData({
          date: new Date(reportToView.date).toISOString().split('T')[0],
          hoursWorked: reportToView.hoursWorked.toString(),
          selectedTasks: reportToView.selectedTasks.map(task => task.id),
          summary: reportToView.summary || '',
          challenges: reportToView.challenges || '',
          plans: reportToView.plans || ''
        });
        setIsViewMode(true);
        setErrors({});
      } else if (reportToEdit) {
        setFormData({
          date: new Date(reportToEdit.date).toISOString().split('T')[0],
          hoursWorked: reportToEdit.hoursWorked.toString(),
          selectedTasks: reportToEdit.selectedTasks.map(task => task.id),
          summary: reportToEdit.summary || '',
          challenges: reportToEdit.challenges || '',
          plans: reportToEdit.plans || ''
        });
        setIsViewMode(false);
        setErrors({});
      } else {
        setFormData({
          date: '',
          hoursWorked: '',
          selectedTasks: [],
          summary: '',
          challenges: '',
          plans: ''
        });
        setIsViewMode(false);
        setErrors({});
      }
      console.log('NewReportModal: isViewMode=', isViewMode); // Debug log
    }
  }, [isOpen, reportToEdit, reportToView]);

  const validateForm = () => {
    const newErrors = {};

    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (isNaN(new Date(formData.date).getTime())) {
      newErrors.date = 'Invalid date';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selectedDate > today) {
        newErrors.date = 'Date cannot be in the future';
      }
    }

    // Hours worked validation
    if (!formData.hoursWorked) {
      newErrors.hoursWorked = 'Hours worked is required';
    } else if (parseFloat(formData.hoursWorked) <= 0) {
      newErrors.hoursWorked = 'Hours worked must be greater than 0';
    } else if (parseFloat(formData.hoursWorked) > 24) {
      newErrors.hoursWorked = 'Hours worked cannot exceed 24 hours';
    }

    // Task selection validation
    if (tasks.length > 0 && formData.selectedTasks.length === 0) {
      newErrors.selectedTasks = 'At least one task must be selected';
    }

    // Summary validation
    if (!formData.summary.trim()) {
      newErrors.summary = 'Daily summary is required';
    } else if (formData.summary.length > 1000) {
      newErrors.summary = 'Summary cannot exceed 1000 characters';
    }

    // Challenges validation (optional, only check length)
    if (formData.challenges.length > 1000) {
      newErrors.challenges = 'Challenges cannot exceed 1000 characters';
    }

    // Plans validation (optional, only check length)
    if (formData.plans.length > 1000) {
      newErrors.plans = 'Plans cannot exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    if (isViewMode) return;
    
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleTaskChange = (taskId, checked) => {
    if (isViewMode) return;
    setFormData(prev => ({
      ...prev,
      selectedTasks: checked
        ? [...prev.selectedTasks, taskId]
        : prev.selectedTasks.filter(id => id !== taskId)
    }));
    setErrors(prev => ({ ...prev, selectedTasks: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isViewMode) return;

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      onSubmit(formData);
      onClose({ wasSubmitted: true, isViewing: false });
    } catch (error) {
      toast.error(`Failed to submit report: ${error.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/50 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FiFileText className="text-blue-500" />
            {isViewMode ? 'View Daily Report' : reportToEdit ? 'Edit Daily Report' : 'New Daily Report'}
          </h2>
          <button 
            onClick={() => onClose({ wasSubmitted: false, isViewing: isViewMode })}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FiCalendar className="text-blue-500" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                required
                disabled={isViewMode}
                aria-invalid={!!errors.date}
                aria-describedby={errors.date ? 'date-error' : undefined}
              />
              {errors.date && (
                <p id="date-error" className="mt-1 text-sm text-red-500">{errors.date}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <FiClock className="text-blue-500" />
                  Hours Worked
                </label>
                <input
                  type="number"
                  name="hoursWorked"
                  value={formData.hoursWorked}
                  onChange={handleChange}
                  min="0"
                  max="24"
                  step="0.5"
                  className={`w-full border ${errors.hoursWorked ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isViewMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="8.5"
                  required
                  disabled={isViewMode}
                  aria-invalid={!!errors.hoursWorked}
                  aria-describedby={errors.hoursWorked ? 'hoursWorked-error' : undefined}
                />
                {errors.hoursWorked && (
                  <p id="hoursWorked-error" className="mt-1 text-sm text-red-500">{errors.hoursWorked}</p>
                )}
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <FiCheckCircle className="text-blue-500" />
                  {isViewMode ? 'Completed Tasks' : 'Select Completed Tasks'}
                </label>
                {isViewMode ? (
                  <div className="border border-gray-300 rounded-md p-3 min-h-10 bg-gray-50">
                    {formData.selectedTasks.length === 0 ? (
                      <p className="text-gray-500">No tasks selected</p>
                    ) : (
                      <ul className="list-disc pl-5 space-y-1">
                        {tasks
                          .filter(task => formData.selectedTasks.includes(task.id))
                          .map((task, index) => (
                            <li key={index} className="text-sm">{task.text}</li>
                          ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <div className={`border ${errors.selectedTasks ? 'border-red-500' : 'border-gray-300'} rounded-md p-3 bg-white`}>
                    {tasks.length === 0 ? (
                      <p className="text-gray-500 text-sm">No tasks available</p>
                    ) : (
                      <ul className="space-y-2 max-h-40 overflow-y-auto">
                        {tasks.map((task) => (
                          <li key={task.id} className="flex items-center">
                            <label className="flex items-center space-x-2 w-full cursor-pointer">
                              <input
                                type="checkbox"
                                name="selectedTasks"
                                value={task.id}
                                checked={formData.selectedTasks.includes(task.id)}
                                onChange={(e) => handleTaskChange(task.id, e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                disabled={isViewMode}
                              />
                              <span className="text-sm text-gray-700 flex-1">{task.text}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                {errors.selectedTasks && (
                  <p id="selectedTasks-error" className="mt-1 text-sm text-red-500">{errors.selectedTasks}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FiList className="text-blue-500" />
                Daily Summary
              </label>
              {isViewMode ? (
                <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 min-h-[80px]">
                  <p className="text-gray-700 whitespace-pre-wrap">{formData.summary}</p>
                </div>
              ) : (
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows="3"
                  maxLength="1000"
                  className={`w-full border ${errors.summary ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Summarize what you accomplished today"
                  required
                  aria-invalid={!!errors.summary}
                  aria-describedby={errors.summary ? 'summary-error' : undefined}
                ></textarea>
              )}
              {errors.summary && (
                <p id="summary-error" className="mt-1 text-sm text-red-500">{errors.summary}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Challenges Faced
              </label>
              {isViewMode ? (
                <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 min-h-[60px]">
                  <p className="text-gray-700 whitespace-pre-wrap">{formData.challenges || 'None reported'}</p>
                </div>
              ) : (
                <textarea
                  name="challenges"
                  value={formData.challenges}
                  onChange={handleChange}
                  rows="2"
                  maxLength="1000"
                  className={`w-full border ${errors.challenges ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Describe any challenges or blockers you encountered"
                ></textarea>
              )}
              {errors.challenges && (
                <p id="challenges-error" className="mt-1 text-sm text-red-500">{errors.challenges}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plans for Tomorrow
              </label>
              {isViewMode ? (
                <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 min-h-[60px]">
                  <p className="text-gray-700 whitespace-pre-wrap">{formData.plans || 'None reported'}</p>
                </div>
              ) : (
                <textarea
                  name="plans"
                  value={formData.plans}
                  onChange={handleChange}
                  rows="2"
                  maxLength="1000"
                  className={`w-full border ${errors.plans ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="What do you plan to work on next?"
                ></textarea>
              )}
              {errors.plans && (
                <p id="plans-error" className="mt-1 text-sm text-red-500">{errors.plans}</p>
              )}
            </div>

            {/* Supervisor Feedback */}
            {isViewMode && reportToView && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <FiMessageSquare className="text-red-500" />
                  Supervisor Feedback
                </label>
                <div className="border border-red-100 rounded-md px-3 py-2 bg-red-50 min-h-[60px]">
                  {reportToView.feedback ? (
                    <p className="text-red-800 whitespace-pre-wrap">{reportToView.feedback}</p>
                  ) : (
                    <p className="text-gray-500 italic">No feedback provided</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onClose({ wasSubmitted: false, isViewing: isViewMode })}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            {!isViewMode && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                {reportToEdit ? 'Update Report' : 'Submit Report'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewReportModal;