import { useState } from 'react';
import { Download, ChevronLeft, ChevronRight, Calendar, Clock, Check, X, Eye, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';

function TimesheetApprovals() {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 6;
  const [viewingRequest, setViewingRequest] = useState(null);
  const [activeTab, setActiveTab] = useState('approvals');
  const [selectedIntern, setSelectedIntern] = useState('all');
  const [requests, setRequests] = useState([
    { 
      id: 1, 
      Intern: 'John Doe', 
      date: '4/18/2025', 
      currentTimeIn: '08:00', 
      currentTimeOut: '17:00', 
      requestedTimeIn: '09:00', 
      requestedTimeOut: '18:00', 
      reason: 'Had a doctor appointment in the morning', 
      status: 'pending', 
      submittedAt: '2025-04-18T10:30:00Z' 
    },
    { 
      id: 2, 
      Intern: 'Jane Smith', 
      date: '4/17/2025', 
      currentTimeIn: '08:15', 
      currentTimeOut: '17:30', 
      requestedTimeIn: '08:15', 
      requestedTimeOut: '19:30', 
      reason: 'Needed to stay late to finish project', 
      status: 'pending', 
      submittedAt: '2025-04-17T18:45:00Z' 
    },
  ]);

  // Intern history data
  const [internHistory, setInternHistory] = useState([
    {
      id: 1,
      name: 'Alex Johnson',
      date: '5/16/2025',
      checkIn: '09:00',
      checkOut: '17:30',
      regularHours: 8,
      overtimeHours: 0.5,
      status: 'completed'
    },
    {
      id: 2,
      name: 'Taylor Rivera',
      date: '5/16/2025',
      checkIn: '08:45',
      checkOut: '18:15',
      regularHours: 8,
      overtimeHours: 1.5,
      status: 'completed'
    },
    {
      id: 3,
      name: 'Morgan Chen',
      date: '5/16/2025',
      checkIn: '09:15',
      checkOut: '17:00',
      regularHours: 7.75,
      overtimeHours: 0,
      status: 'completed'
    },
    {
      id: 4,
      name: 'Alex Johnson',
      date: '5/15/2025',
      checkIn: '09:05',
      checkOut: '17:00',
      regularHours: 7.92,
      overtimeHours: 0,
      status: 'completed'
    },
    {
      id: 5,
      name: 'Taylor Rivera',
      date: '5/15/2025',
      checkIn: '08:30',
      checkOut: '18:30',
      regularHours: 8,
      overtimeHours: 2,
      status: 'completed'
    },
    {
      id: 6,
      name: 'Morgan Chen',
      date: '5/15/2025',
      checkIn: '09:00',
      checkOut: '19:00',
      regularHours: 8,
      overtimeHours: 2,
      status: 'completed'
    }
  ]);

  // Get unique intern names for filter dropdown
  const uniqueInterns = ['all', ...new Set(internHistory.map(entry => entry.name))];

  // Format date to "MonthName Day, Year"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Convert time to 12-hour format
  const formatTimeTo12Hour = (timeString) => {
    if (!timeString) return '--';
    
    // Check if it's already in 12-hour format
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }

    // Handle 24-hour format conversion
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12AM
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const StatusBadge = ({ status }) => {
    const statusClasses = {
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    
    const statusText = {
      approved: 'Approved',
      rejected: 'Rejected',
      pending: 'Pending Review',
      completed: 'Completed'
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${statusClasses[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  const handleApprove = (requestId) => {
    if (window.confirm('Are you sure you want to approve this request?')) {
      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status: 'approved' } : req
      ));
      toast.success('Timesheet request has been approved');
      setViewingRequest(null);
    }
  };

  const handleReject = (requestId) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' } : req
      ));
      toast.error('Timesheet request has been rejected');
      setViewingRequest(null);
    }
  };

  const handleViewRequest = (request) => {
    setViewingRequest(request);
    toast.success('Viewing timesheet request details');
  };

  // Filter intern history based on selected intern
  const filteredInternHistory = selectedIntern === 'all' 
    ? internHistory 
    : internHistory.filter(entry => entry.name === selectedIntern);

  // Calculate pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredInternHistory.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredInternHistory.length / entriesPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="text-blue-500" />
            <span>Timesheet Management</span>
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs for navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'approvals'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Edit Requests
          </button>
          <button
            onClick={() => setActiveTab('internHistory')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'internHistory'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Intern Timesheet History
          </button>
        </div>

        {/* Edit Requests Section */}
        {activeTab === 'approvals' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Edit Requests</h2>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intern</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.Intern}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(request.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTimeTo12Hour(request.currentTimeIn)} - {formatTimeTo12Hour(request.currentTimeOut)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                        {formatTimeTo12Hour(request.requestedTimeIn)} - {formatTimeTo12Hour(request.requestedTimeOut)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewRequest(request)}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                            title="View request details"
                          >
                            <Eye size={14} />
                            <span>View</span>
                          </button>
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(request.id)}
                                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                                title="Approve request"
                              >
                                <Check size={14} />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleReject(request.id)}
                                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                                title="Reject request"
                              >
                                <X size={14} />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Intern Timesheet History Section */}
        {activeTab === 'internHistory' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Intern Timesheet History</h2>
                <p className="text-sm text-gray-500">
                  Daily check-in/check-out logs and overtime for interns
                </p>
              </div>
              <div className="flex gap-2">
                {/* Intern Filter Dropdown */}
                <div className="relative">
                  <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    <Filter size={16} />
                    <select 
                      value={selectedIntern}
                      onChange={(e) => setSelectedIntern(e.target.value)}
                      className="appearance-none bg-transparent border-none focus:outline-none"
                    >
                      <option value="all">All Interns</option>
                      {uniqueInterns.filter(name => name !== 'all').map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Regular Hours</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {entry.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(entry.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTimeTo12Hour(entry.checkIn)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTimeTo12Hour(entry.checkOut)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.regularHours} hrs
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${entry.overtimeHours > 0 ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
                        {entry.overtimeHours > 0 ? `${entry.overtimeHours} hrs` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={entry.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination for intern history */}
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstEntry + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastEntry, filteredInternHistory.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredInternHistory.length}</span> entries
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    {[...Array(totalPages)].map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === idx + 1
                            ? 'bg-blue-50 border-blue-500 text-blue-600'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        } text-sm font-medium`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* View Request Modal */}
      {viewingRequest && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit Request Details</h3>
              <button 
                onClick={() => setViewingRequest(null)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Employee</p>
                  <p>{viewingRequest.employee}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p>{formatDate(viewingRequest.date)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Current Time</p>
                <p>{formatTimeTo12Hour(viewingRequest.currentTimeIn)} - {formatTimeTo12Hour(viewingRequest.currentTimeOut)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Requested Time</p>
                <p className="text-yellow-600">
                  {formatTimeTo12Hour(viewingRequest.requestedTimeIn)} - {formatTimeTo12Hour(viewingRequest.requestedTimeOut)}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Reason</p>
                <p className="mt-1 p-2 bg-gray-50 rounded text-sm">
                  {viewingRequest.reason}
                </p>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                {viewingRequest.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleReject(viewingRequest.id)}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                    >
                      <X size={14} />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApprove(viewingRequest.id)}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                    >
                      <Check size={14} />
                      <span>Approve</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => setViewingRequest(null)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <span>Close</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimesheetApprovals;