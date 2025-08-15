import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiCalendar, FiFileText, FiAward, FiLogOut, FiAlertTriangle, FiEdit, FiCoffee, FiChevronLeft, FiChevronRight, FiDownload, FiUser, FiCheck, FiX, FiPlus, FiBarChart2, FiTrendingUp, FiLayout, FiCreditCard, FiMapPin } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../../utils/fixLeaflet'; // Side-effect import for Leaflet marker fix
import { useGeofence } from '../../utils/geofence/useGeofence'; // Assuming src/geofence/

// Sample data
const sampleReports = [
  {
    day: 5,
    date: 'April 18, 2025',
    status: 'Pending',
    tasksCompleted: 4,
    hoursWorked: 5,
    summary: 'Attended training session and worked on personal project.',
    selectedTasks: [],
  },
  {
    day: 4,
    date: 'April 17, 2025',
    status: 'Pending',
    tasksCompleted: 6,
    hoursWorked: 7,
    summary: 'Refactored legacy code and improved performance.',
    selectedTasks: [],
  },
];

const sampleEvaluation = {
  readiness: 78,
  badges: ['React Expert', 'Team Player'],
  skills: { 'Technical Skills': 80, 'Communication': 100 },
  feedback: 'Strong technical aptitude and team collaboration.',
};

const sampleLeaveRequests = [
  { id: 1, type: 'Personal Leave', from: 'May 2, 2025', to: 'May 2, 2025', duration: '1 day', status: 'Pending', reason: 'Family event' },
  { id: 2, type: 'Sick Leave', from: 'April 21, 2025', to: 'April 23, 2025', duration: '3 days', status: 'Approved', reason: 'Flu symptoms' },
];

export default function InternDashboard() {
  const [taskNote, setTaskNote] = useState('');
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Meeting with supervisor to discuss project requirements', completed: false, time: '9:30 AM' },
    { id: 2, text: 'Fix the computer', completed: true, time: '11:45 AM' },
  ]);
  const [activeTab, setActiveTab] = useState('tasks');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
  const [isViewQRModalOpen, setIsViewQRModalOpen] = useState(false);
  const [isCheckInFlow, setIsCheckInFlow] = useState(false);

  // State for Daily Reports task selection
  const [reports, setReports] = useState(sampleReports);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [reportSummary, setReportSummary] = useState('');
  const [reportHours, setReportHours] = useState('');

  // Geofence hook
  const {
    location,
    error: locationError,
    loading: locationLoading,
    isWithinFence,
    distanceFromCenter,
    fenceCenter,
    fenceRadius
  } = useGeofence();

  const navigate = useNavigate();

  const entries = [
    { date: '4/26/2025', timeIn: '8:00 AM', timeOut: '5:00 PM', overtime: '--', totalHours: '8 hours', status: 'approved' },
    { date: '4/25/2025', timeIn: '8:15 AM', timeOut: '5:30 PM', overtime: '0.5 hours', totalHours: '8.25 hours', status: 'approved' },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 6;
  const totalEntries = 20;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getFormattedTime = () => {
    return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formattedDate = currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const addTask = () => {
    if (taskNote.trim() !== '') {
      const newTask = {
        id: tasks.length + 1,
        text: taskNote,
        completed: false,
        time: getFormattedTime(),
      };
      setTasks([...tasks, newTask]);
      setTaskNote('');
    }
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleCheckIn = () => {
    if (!isWithinFence) {
      alert(`You must be within ${fenceRadius}km of the company to check in. Current distance: ${distanceFromCenter?.toFixed(2)} km`);
      return;
    }
    setIsCheckInFlow(true);
    setIsQRModalOpen(true);
  };

  const handleCheckOut = () => {
    setIsCheckInFlow(false);
    setIsQRModalOpen(true);
  };

  const handleQRDone = () => {
    setIsQRModalOpen(false);
    if (isCheckInFlow) {
      setIsFaceModalOpen(true);
    } else {
      setIsCheckedIn(false);
      setCheckInTime(null);
    }
  };

  const handleQRCancel = () => {
    setIsQRModalOpen(false);
  };

  const handleFaceDone = () => {
    setIsFaceModalOpen(false);
    setIsCheckedIn(true);
    setCheckInTime(getFormattedTime());
  };

  const handleFaceCancel = () => {
    setIsFaceModalOpen(false);
  };

  const handleViewQRCode = () => {
    setIsViewQRModalOpen(true);
  };

  const handleViewQRClose = () => {
    setIsViewQRModalOpen(false);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = '';
    link.download = 'my-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTimesheetEdit = () => {
    navigate('/intern/my-timesheet');
  };

  const handleFileLeave = () => {
    navigate('/intern/leave-management');
  };

  // Handle task selection for Daily Reports
  const handleTaskSelection = (taskId) => {
    setSelectedTaskIds(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  // Handle report submission
  const handleSubmitReport = () => {
    if (!reportSummary.trim() || !reportHours.trim()) {
      alert('Please provide a summary and hours worked.');
      return;
    }

    const selectedTasks = tasks.filter(task => selectedTaskIds.includes(task.id));
    const newReport = {
      day: reports.length + 1,
      date: formattedDate,
      status: 'Pending',
      tasksCompleted: selectedTasks.length,
      hoursWorked: parseFloat(reportHours) || 0,
      summary: reportSummary,
      selectedTasks,
    };

    setReports([newReport, ...reports]);
    setSelectedTaskIds([]);
    setReportSummary('');
    setReportHours('');
    alert('Report submitted successfully!');
  };

  const StatusBadge = ({ status }) => {
    const statusClasses = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusClasses[status.toLowerCase()]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Modal components
  const QRModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Scan QR Code</h2>
          {!isWithinFence && (
            <div className="text-red-500 text-sm mt-1 flex items-center">
              <FiAlertTriangle className="mr-1" />
              You must be within the company geofence to check in
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-4">
            <p className="text-gray-500">Camera Feed Placeholder</p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleQRCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleQRDone}
              disabled={!isWithinFence}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isWithinFence 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const FaceModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Facial Recognition</h2>
        </div>
        <div className="p-6">
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-4">
            <p className="text-gray-500">Facial Recognition Camera Placeholder</p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleFaceCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleFaceDone}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ViewQRModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">My QR Code</h2>
        </div>
        <div className="p-6">
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-4">
            <img src="/path-to-qr-code.png" alt="My QR Code" className="w-48 h-48" />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleViewQRClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleDownloadQR}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <FiDownload className="mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Tab content component
  const TabContent = () => {
    switch (activeTab) {
      case 'tasks':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiFileText className="text-blue-500" />
                <span>Task Notes</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="mb-6 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a new task note..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={taskNote}
                  onChange={(e) => setTaskNote(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <button
                  onClick={addTask}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors flex items-center justify-center"
                  aria-label="Add task"
                >
                  <FiPlus size={18} />
                </button>
              </div>
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FiCoffee size={48} className="mx-auto mb-2 text-gray-400" />
                  <p>No tasks for today! Add one to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="bg-gray-50 rounded-lg p-4 flex items-center group hover:bg-gray-100 transition-colors">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0 transition-colors ${task.completed ? 'bg-green-500' : 'border-2 border-gray-300 hover:border-blue-500'}`}
                        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {task.completed && <FiCheck size={14} className="text-white" />}
                      </button>
                      <div className="flex-1">
                        <span className={`${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                          {task.text}
                        </span>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <FiClock size={12} className="mr-1" /> {task.time}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Delete task"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'timesheet':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiCalendar className="text-blue-500" />
                <span>My Timesheet</span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time In
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Out
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Overtime
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Hours
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entries.map((entry, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {entry.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.timeIn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.timeOut}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.overtime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.totalHours}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={entry.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
              <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{entriesPerPage}</span> of{' '}
                <span className="font-medium">{totalEntries}</span> entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiChevronLeft size={18} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-md ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && <span className="px-2">...</span>}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-10 h-10 flex items-center justify-center rounded-md ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiFileText className="text-blue-500" />
                <span>Daily Reports</span>
              </h2>
            </div>
            <div className="p-6">
              <div>
                <h4 className="font-medium mb-2">Previous Reports</h4>
                {reports.length === 0 ? (
                  <p className="text-gray-500">No reports submitted yet.</p>
                ) : (
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <div key={report.day} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-700">Day {report.day} - {report.date}</p>
                            <p className="text-sm text-gray-500">{report.summary}</p>
                            <p className="text-sm text-gray-500">
                              {report.tasksCompleted} tasks, {report.hoursWorked}h
                            </p>
                            {report.selectedTasks.length > 0 && (
                              <ul className="list-disc pl-5 text-sm text-gray-500 mt-1">
                                {report.selectedTasks.map((task) => (
                                  <li key={task.id}>{task.text}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <StatusBadge status={report.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'leave management':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiCreditCard className="text-blue-500" />
                <span>Leave Management</span>
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-500 mb-4">View your leave requests</p>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sampleLeaveRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{request.from}</div>
                          <div className="text-xs text-gray-400">to {request.to}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.duration}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={request.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="max-w-xs truncate" title={request.reason}>
                            {request.reason}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FiLayout className="text-blue-500" />
            <span>Intern Dashboard</span>
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button
            onClick={handleCheckIn}
            disabled={!isWithinFence || isCheckedIn}
            className={`${isCheckedIn ? 'bg-gray-500' : isWithinFence ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'} rounded-lg p-4 text-white transition-colors shadow-sm`}
          >
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold">{isCheckedIn ? 'CHECKED IN' : 'TIME IN'}</h2>
              <p className="text-sm">{isCheckedIn ? `Time: ${checkInTime}` : `Current: ${getFormattedTime()}`}</p>
              {!isWithinFence && !isCheckedIn && (
                <p className="text-xs mt-1">(Must be on-site)</p>
              )}
            </div>
          </button>
          <button
            onClick={handleCheckOut}
            className={`${!isCheckedIn ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} rounded-lg p-4 text-white transition-colors shadow-sm`}
            disabled={!isCheckedIn}
          >
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold">TIME OUT</h2>
              <p className="text-sm">Current: {getFormattedTime()}</p>
            </div>
          </button>
          <button
            onClick={handleTimesheetEdit}
            className="bg-yellow-500 hover:bg-yellow-600 rounded-lg p-4 text-white transition-colors shadow-sm flex flex-col items-center justify-center"
          >
            <FiEdit size={20} className="mb-1" />
            <h2 className="text-base font-medium">Request Timesheet Edit</h2>
          </button>
          <button
            onClick={handleFileLeave}
            className="bg-purple-500 hover:bg-purple-600 rounded-lg p-4 text-white transition-colors shadow-sm flex flex-col items-center justify-center"
          >
            <FiLogOut size={20} className="mb-1" />
            <h2 className="text-base font-medium">File a Leave</h2>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 col-span-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
              <FiMapPin className="mr-1" /> Today's Status
            </h3>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${isCheckedIn ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <h2 className="text-xl font-bold text-gray-700">{isCheckedIn ? 'Checked In' : 'Not Checked In'}</h2>
            </div>
            <p className="text-gray-500 text-sm mt-1">Expected Hours: 8:00 AM - 05:00 PM</p>
            {!isCheckedIn && (
              <div className="mt-2 flex items-center text-yellow-600 bg-yellow-50 p-2 rounded text-xs">
                <FiAlertTriangle size={14} className="mr-1" />
                <span>Remember to check in when you arrive</span>
              </div>
            )}
          </div>
          <div className="bg-blue-500 rounded-lg p-4 shadow-sm text-white">
            <div className="text-center">
              <button
                onClick={handleViewQRCode}
                className="mb-2 flex items-center justify-center mx-auto text-white hover:text-gray-200 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                View My QR Code
              </button>
              <div className="bg-white rounded p-4 w-32 h-32 mx-auto grid grid-cols-3 gap-2">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-blue-500 rounded-sm"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-6 relative z-0">
          <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
            <FiMapPin className="mr-1" /> Location Status
          </h3>
          {locationLoading ? (
            <p className="text-gray-500">Detecting your location...</p>
          ) : locationError ? (
            <div className="text-red-500">{locationError}</div>
          ) : location ? (
            <div>
              <div className="flex items-center mb-2">
                <div className={`w-3 h-3 rounded-full mr-2 ${isWithinFence ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-700">
                  {isWithinFence ? 'Within company geofence' : 'Outside company geofence'}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Distance: {distanceFromCenter?.toFixed(2)} km from center
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Accuracy: ±{location.accuracy.toFixed(0)} meters
              </div>
              <div className="mt-4 h-64">
                <MapContainer
                  center={[fenceCenter.lat, fenceCenter.lng]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Circle
                    center={[fenceCenter.lat, fenceCenter.lng]}
                    radius={fenceRadius * 1000} // Convert km to meters
                    pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
                  >
                    <Popup>Geofence: The Lewis College</Popup>
                  </Circle>
                  <Marker position={[fenceCenter.lat, fenceCenter.lng]}>
                    <Popup>The Lewis College</Popup>
                  </Marker>
                  {location && (
                    <Marker position={[location.latitude, location.longitude]}>
                      <Popup>Your Location</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Location not available</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-1">
          {[
            { id: 'tasks', name: 'Task Notes', icon: FiFileText },
            { id: 'timesheet', name: 'My Timesheet', icon: FiCalendar },
            { id: 'reports', name: 'Daily Reports', icon: FiFileText },
            { id: 'leave management', name: 'Leave', icon: FiCreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm flex items-center transition-colors ${activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              <tab.icon size={16} className="mr-1" />
              {tab.name}
            </button>
          ))}
        </div>
        <TabContent />
        {isQRModalOpen && <QRModal />}
        {isFaceModalOpen && <FaceModal />}
        {isViewQRModalOpen && <ViewQRModal />}
      </main>
    </div>
  );
}