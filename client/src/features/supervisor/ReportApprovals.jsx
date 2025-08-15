import { useState } from 'react';
import { 
  FiCheck, FiX, FiFileText, FiEye, FiChevronDown, FiAlertCircle, 
  FiCalendar, FiMessageSquare, FiUser, FiClock, FiSearch,
  FiDownload, FiRefreshCw
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

function StatusBadge({ status }) {
  const statusColors = {
    Approved: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Improve: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColors[status]}`}>
      {status}
    </span>
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
        <div className="p-2 rounded-full bg-white shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}

function ReportApprovals() {
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [internFilter, setInternFilter] = useState('All Interns');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedReportForFeedback, setSelectedReportForFeedback] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const [reports, setReports] = useState([
    {
      id: 1,
      day: 5,
      date: 'April 18, 2025',
      status: 'Pending',
      tasksCompleted: 4,
      hoursWorked: 5,
      summary: 'Attended training session and worked on personal project.',
      challenges: 'Training took longer than expected.',
      plans: 'Will catch up on missed work tomorrow.',
      internName: 'Juan Dela Cruz',
      feedback: '',
      submittedAt: '2025-04-18T16:30:00',
      selectedTasks: [
        { id: 1, text: "Training session", completed: false, time: "10:00 AM" },
        { id: 2, text: "Personal project", completed: true, time: "1:00 PM" }
      ]
    },
    {
      id: 2,
      day: 4,
      date: 'April 17, 2025',
      status: 'Pending',
      tasksCompleted: 6,
      hoursWorked: 7,
      summary: 'Refactored legacy code and improved performance.',
      challenges: 'Legacy code was poorly documented.',
      plans: 'Will continue refactoring and add documentation.',
      internName: 'Maria Santos',
      feedback: '',
      submittedAt: '2025-04-17T17:15:00',
      selectedTasks: [
        { id: 5, text: "Code refactoring", completed: true, time: "9:30 AM" },
        { id: 6, text: "Performance testing", completed: true, time: "2:45 PM" }
      ]
    },
    {
      id: 3,
      day: 3,
      date: 'April 16, 2025',
      status: 'Approved',
      tasksCompleted: 7,
      hoursWorked: 7.5,
      summary: 'Implemented new features and wrote documentation.',
      challenges: 'None',
      plans: 'Will review code with team lead.',
      internName: 'Juan Dela Cruz',
      feedback: '',
      submittedAt: '2025-04-16T17:00:00',
      reviewedAt: '2025-04-17T09:25:00',
      reviewedBy: 'Supervisor Name',
      selectedTasks: [
        { id: 3, text: "Code implementation", completed: true, time: "9:00 AM" },
        { id: 4, text: "Documentation", completed: false, time: "3:00 PM" }
      ]
    },
    {
      id: 4,
      day: 2,
      date: 'April 15, 2025',
      status: 'Improve',
      tasksCompleted: 5,
      hoursWorked: 6,
      summary: 'Worked on frontend components and fixed some bugs.',
      challenges: 'Some components were not responsive on mobile devices.',
      plans: 'Will focus on mobile responsiveness tomorrow.',
      internName: 'Maria Santos',
      feedback: 'Please provide more details on the bugs you fixed and how you approached mobile responsiveness.',
      submittedAt: '2025-04-15T16:00:00',
      reviewedAt: '2025-04-16T10:15:00',
      reviewedBy: 'Supervisor Name',
      selectedTasks: []
    },
    {
      id: 5,
      day: 1,
      date: 'April 14, 2025',
      status: 'Approved',
      tasksCompleted: 8,
      hoursWorked: 8.5,
      summary: 'Completed all assigned tasks and attended team meeting.',
      challenges: 'Had some issues with the database connection.',
      plans: 'Will work on optimizing the database queries.',
      internName: 'Juan Dela Cruz',
      feedback: '',
      submittedAt: '2025-04-14T17:30:00',
      reviewedAt: '2025-04-15T09:00:00',
      reviewedBy: 'Supervisor Name',
      selectedTasks: []
    },
  ]);

  // Get unique intern names for filtering
  const interns = ['All Interns', ...new Set(reports.map(report => report.internName))];

  const handleAction = (id, action, feedbackMessage = '') => {
    setReports(prev =>
      prev.map(r =>
        r.id === id ? { 
          ...r, 
          status: action,
          feedback: action === 'Improve' ? feedbackMessage : r.feedback,
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'Supervisor Name'
        } : r
      )
    );
    // Add toast notification based on action
    if (action === 'Approved') {
      toast.success('Report has been approved successfully!');
    } else if (action === 'Improve') {
      toast.success('Feedback has been submitted!');
    }
  };

  const openFeedbackModal = (report) => {
    setSelectedReportForFeedback(report);
    setFeedbackText(report.feedback || '');
    setShowFeedbackModal(true);
  };

  const submitFeedback = () => {
    if (!feedbackText.trim()) {
      toast.error('Please enter feedback before submitting');
      return;
    }

    if (selectedReportForFeedback) {
      const action = selectedReportForFeedback.status === 'Pending' ? 'Improve' : selectedReportForFeedback.status;
      handleAction(selectedReportForFeedback.id, action, feedbackText);
      setShowFeedbackModal(false);
      setSelectedReportForFeedback(null);
      setFeedbackText('');
    }
  };

  // Filter and sort reports
  const filteredReports = reports
    .filter(r => statusFilter === 'All Status' || r.status === statusFilter)
    .filter(r => internFilter === 'All Interns' || r.internName === internFilter)
    .filter(r => !dateFilter || r.date.includes(dateFilter))
    .filter(r => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        r.internName.toLowerCase().includes(query) ||
        r.summary.toLowerCase().includes(query) ||
        r.challenges.toLowerCase().includes(query) ||
        r.plans.toLowerCase().includes(query)
      );
    });

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      case 'oldest':
        return new Date(a.submittedAt) - new Date(b.submittedAt);
      case 'hours-high':
        return b.hoursWorked - a.hoursWorked;
      case 'hours-low':
        return a.hoursWorked - b.hoursWorked;
      case 'tasks-high':
        return b.tasksCompleted - a.tasksCompleted;
      case 'tasks-low':
        return a.tasksCompleted - b.tasksCompleted;
      default:
        return new Date(b.submittedAt) - new Date(a.submittedAt);
    }
  });
  
  // Stats calculations
  const totalReports = reports.length;
  const approvedReports = reports.filter(r => r.status === 'Approved').length;
  const pendingReports = reports.filter(r => r.status === 'Pending').length;
  const improveReports = reports.filter(r => r.status === 'Improve').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FiFileText className="text-blue-500" />
              <span>Report Approvals</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Summary Cards at the top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SummaryCard
            count={totalReports}
            label="Total Reports"
            icon={<FiFileText className="text-blue-500" size={24} />}
            bgColor="bg-blue-50"
            textColor="text-blue-800"
          />
          <SummaryCard
            count={approvedReports}
            label="Approved"
            icon={<FiCheck className="text-green-500" size={24} />}
            bgColor="bg-green-50"
            textColor="text-green-800"
          />
          <SummaryCard
            count={pendingReports}
            label="Pending Review"
            icon={<FiAlertCircle className="text-yellow-500" size={24} />}
            bgColor="bg-yellow-50"
            textColor="text-yellow-800"
          />
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Status Filter */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <div className="relative">
                <select
                  className="appearance-none w-full bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Status</option>
                  <option>Approved</option>
                  <option>Pending</option>
                  <option>Improve</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiChevronDown size={16} />
                </div>
              </div>
            </div>
            
            {/* Intern Filter */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-1">Intern</label>
              <div className="relative">
                <select
                  className="appearance-none w-full bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={internFilter}
                  onChange={(e) => setInternFilter(e.target.value)}
                >
                  {interns.map(intern => (
                    <option key={intern}>{intern}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiChevronDown size={16} />
                </div>
              </div>
            </div>
            
            {/* Date Filter */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-1">Filter by Date</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Date filter e.g. April"
                  className="w-full border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiCalendar size={16} />
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="w-full border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiSearch size={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              {filteredReports.length} reports found
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Sort by:</label>
              <select
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="hours-high">Hours (High to Low)</option>
                <option value="hours-low">Hours (Low to High)</option>
                <option value="tasks-high">Tasks (High to Low)</option>
                <option value="tasks-low">Tasks (Low to High)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Report Cards */}
        <div className="space-y-4">
          {sortedReports.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-gray-500">No reports found matching your filters</p>
            </div>
          ) : (
            sortedReports.map(report => (
              <div key={report.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">Day {report.day} - {report.internName}</h3>
                      <StatusBadge status={report.status} />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <FiCalendar size={14} />
                        <span>{report.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock size={14} />
                        <span>Submitted {new Date(report.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {report.reviewedAt && (
                        <div className="flex items-center gap-1">
                          <FiUser size={14} />
                          <span>Reviewed by {report.reviewedBy}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm">
                      <p><strong>Tasks:</strong> {report.tasksCompleted} &nbsp; | &nbsp; <strong>Hours:</strong> {report.hoursWorked}h</p>
                      <p className="mt-2"><strong>Summary:</strong> {report.summary}</p>
                      {report.feedback && (
                        <div className="mt-2 p-2 bg-gray-50 rounded border-l-4 border-blue-400">
                          <strong>Feedback:</strong> {report.feedback}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                    >
                      <FiEye size={14} />
                      <span>View</span>
                    </button>
                    {report.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleAction(report.id, 'Approved')}
                          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100"
                        >
                          <FiCheck size={14} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => openFeedbackModal(report)}
                          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                        >
                          <FiMessageSquare size={14} />
                          <span>Feedback</span>
                        </button>
                      </>
                    )}
                    {report.status === 'Improve' && (
                      <button
                        onClick={() => openFeedbackModal(report)}
                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                      >
                        <FiMessageSquare size={14} />
                        <span>Edit Feedback</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* View Report Modal - Landscape Layout */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-5 relative mx-4">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <FiX size={24} />
            </button>
            
            <div className="mb-3 border-b pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Day {selectedReport.day} – {selectedReport.date}</h3>
                  <p className="text-gray-600">{selectedReport.internName}</p>
                </div>
                <StatusBadge status={selectedReport.status} />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="font-medium text-gray-700 mb-2">Report Details</h4>
                  <div className="grid grid-cols-2 text-sm gap-2">
                    <div>
                      <p><strong>Tasks:</strong> {selectedReport.tasksCompleted}</p>
                      <p><strong>Hours:</strong> {selectedReport.hoursWorked}</p>
                    </div>
                    <div>
                      <p><strong>Submitted:</strong> {new Date(selectedReport.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      {selectedReport.reviewedAt && (
                        <p><strong>Reviewed:</strong> {new Date(selectedReport.reviewedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Summary</h4>
                  <p className="text-sm bg-white p-2 rounded border border-gray-100">{selectedReport.summary}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Challenges</h4>
                  <p className="text-sm bg-white p-2 rounded border border-gray-100">{selectedReport.challenges}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Plans for Next Day</h4>
                  <p className="text-sm bg-white p-2 rounded border border-gray-100">{selectedReport.plans}</p>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-4">
                {selectedReport.selectedTasks && selectedReport.selectedTasks.length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="font-medium text-gray-700 mb-2">Tasks Included</h4>
                    <ul className="text-sm space-y-1">
                      {selectedReport.selectedTasks.map((task, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className={`inline-block mt-1 w-2 h-2 rounded-full ${task.completed ? '' : ''}`}></span>
                          <span>
                            {task.text} <span className="text-xs text-gray-500">({task.time})</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className={`p-3 rounded-md ${selectedReport.feedback ? 'bg-blue-50' : 'bg-gray-50'}`}>
                  <h4 className="font-medium text-gray-700 mb-2">Supervisor Feedback</h4>
                  <div className="text-sm">
                    {selectedReport.feedback ? (
                      <p>{selectedReport.feedback}</p>
                    ) : (
                      <p className="text-gray-400 italic">No feedback provided yet.</p>
                    )}
                  </div>
                </div>
                
                {selectedReport.status === 'Pending' && (
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => {
                        handleAction(selectedReport.id, 'Approved');
                        setSelectedReport(null);
                      }}
                      className="flex-1 py-2 text-green-600 bg-green-50 rounded-md hover:bg-green-100 text-sm font-medium"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <FiCheck size={16} />
                        <span>Approve Report</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedReport(null);
                        openFeedbackModal(selectedReport);
                      }}
                      className="flex-1 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 text-sm font-medium"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <FiMessageSquare size={16} />
                        <span>Provide Feedback</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative mx-4">
            <button
              onClick={() => {
                setShowFeedbackModal(false);
                setSelectedReportForFeedback(null);
                setFeedbackText('');
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <FiX size={24} />
            </button>
            <h3 className="text-lg font-semibold mb-4">
              {selectedReportForFeedback?.status === 'Pending' ? 'Provide Feedback' : 'Edit Feedback'}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={5}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Enter your feedback for the intern..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setSelectedReportForFeedback(null);
                  setFeedbackText('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportApprovals;