import { useState } from 'react';
import { FiPlus, FiChevronDown, FiFileText, FiUser, FiCalendar, FiClock, FiCheck, FiX, FiAlertCircle, FiEye } from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';
import ApplyForLeaveModal from '../../modals/ApplyForLeaveModal';
import ViewLeaveRequest from '../../modals/ViewLeaveRequest';

function LeaveManagement() {
  const [activeTab, setActiveTab] = useState('My Leaves');
  const [entriesPerPage, setEntriesPerPage] = useState('5');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewRequest, setViewRequest] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([
    { 
      id: 1,
      type: 'Personal Leave', 
      from: 'May 2, 2025', 
      to: 'May 2, 2025', 
      duration: '1 day', 
      status: 'Pending', 
      appliedOn: 'April 14, 2025',
      reason: 'Family event',
      contactInfo: '',
      isHalfDay: false,
      halfDayType: ''
    },
    { 
      id: 2,
      type: 'Sick Leave', 
      from: 'April 21, 2025', 
      to: 'April 23, 2025', 
      duration: '3 days', 
      status: 'Approved', 
      appliedOn: 'April 21, 2025',
      reason: 'Flu symptoms',
      contactInfo: '555-1234',
      isHalfDay: false,
      halfDayType: ''
    },
    { 
      id: 3,
      type: 'Academic Leave', 
      from: 'March 31, 2025', 
      to: 'March 31, 2025', 
      duration: '1 day', 
      status: 'Approved', 
      appliedOn: 'March 21, 2025',
      reason: 'Final exams',
      contactInfo: '',
      isHalfDay: false,
      halfDayType: ''
    },
    { 
      id: 4,
      type: 'Academic Leave', 
      from: 'March 31, 2025', 
      to: 'March 31, 2025', 
      duration: '1 day', 
      status: 'Rejected', 
      appliedOn: 'March 21, 2025',
      reason: 'Study leave',
      contactInfo: '',
      isHalfDay: false,
      halfDayType: ''
    },
    { 
      id: 5,
      type: 'Sick Leave', 
      from: 'March 5, 2025', 
      to: 'March 5, 2025', 
      duration: '1 day', 
      status: 'Approved', 
      appliedOn: 'March 4, 2025',
      reason: 'Doctor appointment',
      contactInfo: '555-5678',
      isHalfDay: false,
      halfDayType: ''
    }
  ]);

  const sortedLeaveRequests = [...leaveRequests].sort((a, b) => {
    return new Date(b.appliedOn) - new Date(a.appliedOn);
  });

  const approvedLeaves = leaveRequests.filter(req => req.status === 'Approved').length;
  const pendingRequests = leaveRequests.filter(req => req.status === 'Pending').length;
  const rejectedRequests = leaveRequests.filter(req => req.status === 'Rejected').length;

  const handleLeaveSubmit = (formData) => {
    try {
      const fromDate = new Date(formData.from);
      const toDate = new Date(formData.to);
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        throw new Error('Invalid date provided');
      }
      if (fromDate > toDate) {
        throw new Error('Start date cannot be after end date');
      }

      const newRequest = {
        id: leaveRequests.length > 0 ? Math.max(...leaveRequests.map(r => r.id)) + 1 : 1,
        type: formData.leaveType,
        from: formData.from,
        to: formData.to,
        duration: formData.duration,
        status: 'Pending',
        appliedOn: formData.appliedOn,
        reason: formData.reason,
        contactInfo: formData.contactInfo,
        isHalfDay: formData.isHalfDay,
        halfDayType: formData.isHalfDay ? formData.halfDayType : ''
      };
      
      setLeaveRequests([newRequest, ...leaveRequests]);
      toast.success('Leave request submitted successfully!');
    } catch (error) {
      toast.error(`Failed to submit leave request: ${error.message}`);
      throw error;
    }
  };

  const handleCancelRequest = (id) => {
    setLeaveRequests(leaveRequests.filter(request => request.id !== id));
    toast.success('Leave request cancelled successfully!');
  };

  const openApplyModal = () => {
    setIsModalOpen(true);
  };

  const closeApplyModal = ({ wasSubmitted = false } = {}) => {
    setIsModalOpen(false);
    if (!wasSubmitted) {
      toast.error('Leave request cancelled');
    }
  };

  const closeViewModal = ({ isViewing = false } = {}) => {
    setViewRequest(null);
    // Only show toast if not in viewing mode
    if (!isViewing) {
      toast.error('Leave request cancelled');
    }
  };

  function TabButton({ label, active, onClick, icon }) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${
          active 
            ? 'border-blue-500 text-blue-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
      >
        {icon}
        {label}
      </button>
    );
  }

  function SummaryCard({ count, label, icon, bgColor, textColor }) {
    return (
      <div className={`${bgColor} p-4 rounded-lg shadow-sm border border-gray-100`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${textColor}`}>{label}</p>
            <p className={`text-2xl font-semibold mt-1 ${textColor}`}>{count}</p>
          </div>
          <div className="p-2 rounded-full bg-white">
            {icon}
          </div>
        </div>
      </div>
    );
  }

  function StatusBadge({ status }) {
    const getStatusStyles = () => {
      switch (status) {
        case 'Approved':
          return 'bg-green-100 text-green-800';
        case 'Pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'Rejected':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
        {status}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FiCalendar className="text-blue-500" />
            <span>Leave Management</span>
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <TabButton 
              label="My Leaves" 
              active={activeTab === 'My Leaves'} 
              onClick={() => setActiveTab('My Leaves')} 
              icon={<FiFileText size={16} />}
            />
            <TabButton 
              label="Leave Policy" 
              active={activeTab === 'Leave Policy'} 
              onClick={() => setActiveTab('Leave Policy')} 
              icon={<FiFileText size={16} />}
            />
          </nav>
        </div>
        
        {activeTab === 'My Leaves' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <SummaryCard 
                count={approvedLeaves} 
                label="Approved Leaves" 
                icon={<FiCheck className="text-green-500" size={24} />}
                bgColor="bg-green-50"
                textColor="text-green-800"
              />
              <SummaryCard 
                count={pendingRequests} 
                label="Pending Requests" 
                icon={<FiAlertCircle className="text-yellow-500" size={24} />}
                bgColor="bg-yellow-50"
                textColor="text-yellow-800"
              />
              <SummaryCard 
                count={rejectedRequests} 
                label="Rejected Requests" 
                icon={<FiX className="text-red-500" size={24} />}
                bgColor="bg-red-50"
                textColor="text-red-800"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select 
                    className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={entriesPerPage}
                    onChange={(e) => setEntriesPerPage(e.target.value)}
                  >
                    <option>5</option>
                    <option>10</option>
                    <option>15</option>
                    <option>20</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FiChevronDown size={16} />
                  </div>
                </div>
                <span className="text-sm text-gray-600">entries per page</span>
              </div>
              
              <button 
                onClick={openApplyModal}
                className="w-full sm:w-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <FiPlus size={16} />
                <span>Apply for Leave</span>
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leave Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied on
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedLeaveRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{request.from}</div>
                          <div className="text-xs text-gray-400">to {request.to}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={request.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.appliedOn}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="max-w-xs truncate" title={request.reason}>
                            {request.reason}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setViewRequest(request)}
                              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                            >
                              <FiEye size={14} />
                              <span className="hidden sm:inline">View</span>
                            </button>
                            
                            {request.status === 'Pending' && (
                              <button 
                                onClick={() => handleCancelRequest(request.id)}
                                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                              >
                                <FiX size={14} />
                                <span className="hidden sm:inline">Cancel</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Leave Policy</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Our leave policy is designed to support employees while ensuring business continuity. 
                Below are the key aspects of our leave management system:
              </p>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">Leave Types</h3>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li><strong>Sick Leave:</strong> 10 days per year (medical certificate required after 3 consecutive days)</li>
                <li><strong>Personal Leave:</strong> 5 days per year (advance notice required when possible)</li>
                <li><strong>Academic Leave:</strong> For exams and study purposes (requires proof of enrollment)</li>
                <li><strong>Bereavement Leave:</strong> 3 days for immediate family members</li>
              </ul>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">Application Process</h3>
              <ol className="list-decimal pl-5 mb-4 space-y-1">
                <li>Submit leave request at least 3 working days in advance (except emergencies)</li>
                <li>Provide necessary documentation (medical certificates, exam schedules, etc.)</li>
                <li>Await approval from your manager (typically within 2 working days)</li>
              </ol>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">Important Notes</h3>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Unused leave does not carry over to the next year</li>
                <li>Leave during probation period may be restricted</li>
                <li>Excessive absenteeism may require HR consultation</li>
              </ul>
              
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <p className="text-blue-800">
                  For specific questions about your leave balance or special circumstances, 
                  please contact the HR department at <span className="font-medium">hr@company.com</span>.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <ApplyForLeaveModal 
        isOpen={isModalOpen} 
        onClose={closeApplyModal}
        onSubmit={handleLeaveSubmit}
      />

      {viewRequest && (
        <ViewLeaveRequest 
          request={viewRequest}
          onClose={closeViewModal}
        />
      )}
    </div>
  );
}

export default LeaveManagement;