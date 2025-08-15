import { useState, useEffect } from 'react'; 
import { 
  FiCheck, FiX, FiCalendar, FiEye, FiFilter, FiSearch, 
  FiChevronDown, FiAlertCircle, FiClock, FiMessageCircle
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStyles()}`}>{status}</span>;
};

// Summary Card Component
function SummaryCard({ count, label, icon, bgColor, textColor }) {
  return (
    <div className={`${bgColor} p-4 rounded-lg shadow-sm border border-gray-100`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${textColor}`}>{label}</p>
          <p className={`text-2xl font-semibold mt-1 ${textColor}`}>{count}</p>
        </div>
        <div className="p-2 rounded-full bg-white shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}

// Compact Leave Request Modal Component
const LeaveRequestModal = ({ request, onClose, onApprove, onReject, onComment }) => {
  const [comment, setComment] = useState('');
  
  // Reset comment when request changes
  useEffect(() => {
    setComment('');
  }, [request]);

  if (!request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4">
          {/* Compact Header */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-semibold text-gray-900">Leave Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <FiX size={20} />
            </button>
          </div>

          {/* Compact Requestor Info */}
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-blue-100 p-1.5 rounded-full">
              <FiCalendar className="text-blue-600" size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{request.internName}</p>
              <StatusBadge status={request.status} />
            </div>
          </div>

          {/* Tight Grid Layout */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500 font-medium">Leave Type</p>
              <p>{request.type}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500 font-medium">Duration</p>
              <p>{request.duration}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500 font-medium">From</p>
              <p>{request.from}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500 font-medium">To</p>
              <p>{request.to}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500 font-medium">Applied On</p>
              <p>{request.appliedOn}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-gray-500 font-medium">Status</p>
              <StatusBadge status={request.status} />
            </div>
          </div>

          {/* Compact Reason Section */}
          <div className="mb-3">
            <p className="text-xs text-gray-500 font-medium mb-1">Reason</p>
            <div className="bg-gray-50 p-2 rounded text-sm">
              {request.reason}
            </div>
          </div>

          {/* Contact Info (if exists) */}
          {request.contactInfo && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 font-medium mb-1">Contact</p>
              <div className="bg-gray-50 p-2 rounded text-sm">
                {request.contactInfo}
              </div>
            </div>
          )}

          {/* Compact Comments Section */}
          {request.comments?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 font-medium mb-1">Comments ({request.comments.length})</p>
              <div className="space-y-1.5 max-h-[100px] overflow-y-auto">
                {request.comments.map((c, i) => (
                  <div key={`comment-${request.id}-${i}`} className="bg-gray-50 p-2 rounded text-xs">
                    <p className="text-gray-400 text-xxs">{c.date}</p>
                    <p>{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Comment (only for pending) */}
          {request.status === 'Pending' && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 font-medium mb-1">Add Comment</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-gray-200 rounded p-2 text-xs h-16"
                placeholder="Optional comment..."
              />
            </div>
          )}

          {/* Compact Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            {request.status === 'Pending' ? (
              <>
                <button
                  onClick={() => {
                    onReject(request.id, comment);
                    setComment('');
                    onClose();
                  }}
                  className="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center gap-1"
                >
                  <FiX size={12} /> Reject
                </button>
                <button
                  onClick={() => {
                    onApprove(request.id, comment);
                    setComment('');
                    onClose();
                  }}
                  className="px-3 py-1.5 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100 flex items-center gap-1"
                >
                  <FiCheck size={12} /> Approve
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function LeaveApprovals() {
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      internName: 'Juan Dela Cruz',
      type: 'Sick Leave',
      from: 'May 2, 2025',
      to: 'May 2, 2025',
      duration: '1 day',
      appliedOn: 'April 28, 2025',
      reason: 'Fever and headache',
      status: 'Pending',
      contactInfo: '555-1234',
      comments: []
    },
    {
      id: 2,
      internName: 'Maria Santos',
      type: 'Personal Leave',
      from: 'May 5, 2025',
      to: 'May 6, 2025',
      duration: '2 days',
      appliedOn: 'April 29, 2025',
      reason: 'Family event',
      status: 'Pending',
      contactInfo: '',
      comments: []
    },
    {
      id: 3,
      internName: 'Pedro Reyes',
      type: 'Academic Leave',
      from: 'May 10, 2025',
      to: 'May 10, 2025',
      duration: '1 day',
      appliedOn: 'April 30, 2025',
      reason: 'Final Exam',
      status: 'Approved',
      contactInfo: '',
      comments: [
        { date: 'May 1, 2025', text: 'Approved based on academic calendar' }
      ]
    },
    {
      id: 4,
      internName: 'Ana Lim',
      type: 'Sick Leave',
      from: 'April 25, 2025',
      to: 'April 26, 2025',
      duration: '2 days',
      appliedOn: 'April 24, 2025',
      reason: 'Flu symptoms',
      status: 'Rejected',
      contactInfo: '555-5678',
      comments: [
        { date: 'April 24, 2025', text: 'Rejected due to upcoming project deadline' }
      ]
    },
    {
      id: 5,
      internName: 'John Cruz',
      type: 'Personal Leave',
      from: 'May 15, 2025',
      to: 'May 15, 2025',
      duration: '1 day',
      appliedOn: 'May 1, 2025',
      reason: 'Family emergency',
      status: 'Pending',
      contactInfo: '555-9876',
      comments: []
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [entriesPerPage, setEntriesPerPage] = useState('10');

  // Calculate counts for summary cards
  const pendingCount = leaveRequests.filter(req => req.status === 'Pending').length;
  const approvedCount = leaveRequests.filter(req => req.status === 'Approved').length;
  const rejectedCount = leaveRequests.filter(req => req.status === 'Rejected').length;

  // Filter and sort leave requests
  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = 
      request.internName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'All' || 
      request.status === filterStatus;
    
    const matchesType = 
      filterType === 'All' || 
      request.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Get unique leave types for filter
  const leaveTypes = ['All', ...new Set(leaveRequests.map(req => req.type))];

  // Sort filtered requests
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'date') {
      comparison = new Date(a.appliedOn) - new Date(b.appliedOn);
    } else if (sortBy === 'name') {
      comparison = a.internName.localeCompare(b.internName);
    } else if (sortBy === 'type') {
      comparison = a.type.localeCompare(b.type);
    } else if (sortBy === 'duration') {
      comparison = parseInt(a.duration) - parseInt(b.duration);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Handle action functions
  const handleApprove = (id, comment = '') => {
    setLeaveRequests(prev =>
      prev.map(request => {
        if (request.id === id) {
          return { 
            ...request, 
            status: 'Approved',
            comments: comment ? 
              [...request.comments, { 
                date: new Date().toLocaleDateString(), 
                text: comment,
                id: Date.now() + Math.random()
              }] : 
              request.comments
          };
        }
        return request;
      })
    );
  };

  const handleReject = (id, comment = '') => {
    setLeaveRequests(prev =>
      prev.map(request => {
        if (request.id === id) {
          return { 
            ...request, 
            status: 'Rejected',
            comments: comment ? 
              [...request.comments, { 
                date: new Date().toLocaleDateString(), 
                text: comment,
                id: Date.now() + Math.random()
              }] : 
              request.comments
          };
        }
        return request;
      })
    );
  };

  const handleAddComment = (id, comment) => {
    if (!comment.trim()) return;
    
    setLeaveRequests(prev =>
      prev.map(request => {
        if (request.id === id) {
          toast.success('Comment added successfully!');
          return {
            ...request,
            comments: [
              ...request.comments,
              { 
                date: new Date().toLocaleDateString(), 
                text: comment,
                id: Date.now() + Math.random()
              }
            ]
          };
        }
        return request;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FiCalendar className="text-blue-500" />
            <span>Leave Requests</span>
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard 
            count={pendingCount} 
            label="Pending Approvals" 
            icon={<FiClock className="text-yellow-500" size={24} />}
            bgColor="bg-yellow-50"
            textColor="text-yellow-800"
          />
          <SummaryCard 
            count={approvedCount} 
            label="Approved Leaves" 
            icon={<FiCheck className="text-green-500" size={24} />}
            bgColor="bg-green-50"
            textColor="text-green-800"
          />
          <SummaryCard 
            count={rejectedCount} 
            label="Rejected Requests" 
            icon={<FiX className="text-red-500" size={24} />}
            bgColor="bg-red-50"
            textColor="text-red-800"
          />
        </div>
        
        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by name, reason, or leave type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="w-full md:w-48">
              <div className="relative">
                <select
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md appearance-none bg-white leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiChevronDown size={16} />
                </div>
              </div>
            </div>
            
            {/* Leave Type Filter */}
            <div className="w-full md:w-48">
              <div className="relative">
                <select
                  className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md appearance-none bg-white leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  {leaveTypes.map(type => (
                    <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span>Sort by:</span>
                <select
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Date Applied</option>
                  <option value="name">Name</option>
                  <option value="type">Leave Type</option>
                  <option value="duration">Duration</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span>Show:</span>
                <select
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(e.target.value)}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <span>entries</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intern</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedRequests.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center justify-center py-6">
                        <FiAlertCircle size={36} className="text-gray-400 mb-2" />
                        <p>No leave requests found matching your filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            {request.internName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{request.internName}</div>
                            <div className="text-xs text-gray-500">
                              {request.contactInfo ? request.contactInfo : 'No contact info'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{request.from}</div>
                        <div className="text-xs text-gray-400">to {request.to}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.duration}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={request.status} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.appliedOn}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.comments && request.comments.length > 0 ? (
                          <div className="flex items-center gap-1 text-blue-600 cursor-pointer" onClick={() => setSelectedRequest(request)}>
                            <FiMessageCircle size={14} />
                            <span>{request.comments.length}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSelectedRequest(request)}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                          >
                            <FiEye size={14} />
                            <span className="hidden sm:inline">View</span>
                          </button>
                          {request.status === 'Pending' && (
                            <>
                              <button 
                                onClick={() => {
                                  handleApprove(request.id);
                                  toast.success(`Leave request for ${request.internName} has been approved successfully!`);
                                }}
                                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                              >
                                <FiCheck size={14} />
                                <span className="hidden sm:inline">Approve</span>
                              </button>
                              <button 
                                onClick={() => {
                                  handleReject(request.id);
                                  toast.error(`Leave request for ${request.internName} has been rejected.`);
                                }}
                                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                              >
                                <FiX size={14} />
                                <span className="hidden sm:inline">Reject</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{sortedRequests.length}</span> of <span className="font-medium">{leaveRequests.length}</span> leave requests
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">Previous</button>
            <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Next</button>
          </div>
        </div>
      </main>

      {/* View Modal */}
      <LeaveRequestModal 
        request={selectedRequest} 
        onClose={() => setSelectedRequest(null)}
        onApprove={(id, comment) => {
          handleApprove(id, comment);
          const request = leaveRequests.find(req => req.id === id);
          toast.success(`Leave request for ${request.internName} has been approved successfully!`);
        }}
        onReject={(id, comment) => {
          handleReject(id, comment);
          const request = leaveRequests.find(req => req.id === id);
          toast.error(`Leave request for ${request.internName} has been rejected.`);
        }}
        onComment={handleAddComment}
      />
    </div>
  );
}

export default LeaveApprovals;