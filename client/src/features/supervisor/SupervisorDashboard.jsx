import { useState, useEffect, useRef } from 'react';
import { 
  BarChart2, 
  Users, 
  Clipboard, 
  Clock, 
  FileText, 
  TrendingUp, 
  Calendar, 
  Layout,
  AlertTriangle,
  Star,
  ThumbsUp,
  Plus,
  X,
} from 'lucide-react';
import { FiCalendar, FiClock, FiFileText } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const SupervisorDashboard = () => {
  const [activeTab, setActiveTab] = useState('monitoring');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [internTimes, setInternTimes] = useState({
    'John Doe': { checkIn: '8:00 AM', checkOut: '-' },
    'Amy Smith': { checkIn: '9:15 AM', checkOut: '-' },
    'Mike Parker': { checkIn: '8:30 AM', checkOut: '-' },
    'Sara Reed': { checkIn: '-', checkOut: '-' },
    'Tom Brown': { checkIn: '8:00 AM', checkOut: '-' },
  });
  const [defaultCheckIn, setDefaultCheckIn] = useState('08:00'); // Default to 8:00 AM
  const [defaultCheckOut, setDefaultCheckOut] = useState('17:00'); // Default to 5:00 PM
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Team Meeting', time: '10:00 AM' },
    { id: 2, name: 'Project Review', time: '2:00 PM' },
  ]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', time: '' });
  const [hoveredTask, setHoveredTask] = useState(null); // Track hovered task
  const scheduleRef = useRef(null); // Reference to the schedule container

  const entriesPerPage = 6;
  const totalEntries = 20;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const StatusBadge = ({ status }) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      late: 'bg-yellow-100 text-yellow-800',
      absent: 'bg-red-100 text-red-800',
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      improve: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusClasses[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const convertTo24Hour = (time) => {
    if (time === '-') return '';
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const convertTo12Hour = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Function to convert time to minutes for easier comparison
  const timeToMinutes = (time) => {
    if (!time || time === '-') return 0;
    const time24 = convertTo24Hour(time);
    if (!time24) return 0;
    const [hours, minutes] = time24.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Define interns array with updated status calculation
  const interns = Object.keys(internTimes).map((name) => {
    const checkInTime = internTimes[name].checkIn;
    const checkOutTime = internTimes[name].checkOut;
    const defaultCheckInMinutes = timeToMinutes(convertTo12Hour(defaultCheckIn));
    const checkInMinutes = timeToMinutes(checkInTime);
    
    let status;
    if (checkInTime === '-' && checkOutTime === '-') {
      status = 'Absent';
    } else if (checkInTime !== '-') {
      status = checkInMinutes > defaultCheckInMinutes ? 'Late' : 'Active';
    } else {
      status = 'Active'; // Fallback for cases where only checkOut is set (though not in current data)
    }

    return {
      id: name.slice(0, 2).toUpperCase(),
      name,
      status,
      timeIn: checkInTime,
      timeout: checkOutTime,
    };
  });

  const TabContent = () => {
    switch (activeTab) {
      case 'monitoring':
        // Check if all interns are absent (both checkIn and checkOut are '-')
        const allAbsent = Object.values(internTimes).every(
          (time) => time.checkIn === '-' && time.checkOut === '-'
        );
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart2 className="text-blue-500" />
                <span>Current Intern</span>
              </h2>
            </div>
            {allAbsent ? (
              <div className="p-6 text-center text-gray-500">
                <AlertTriangle size={24} className="mx-auto mb-2 text-red-500" />
                <p>No interns currently active - all interns are absent.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intern</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Out</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {interns.map((intern) => (
                      <tr key={intern.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                              {intern.id}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{intern.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={intern.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{intern.timeIn}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{intern.timeout}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => navigate(`/supervisor/timesheet-approvals/`)}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      
      case 'leave':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="text-blue-500" />
                <span>Latest Leave Request</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Mike Parker</h3>
                  <StatusBadge status="Pending" />
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <FiCalendar size={14} />
                    <span>Vacation</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCalendar size={14} />
                    <span>Start: 5/20/2025</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCalendar size={14} />
                    <span>End: 5/25/2025</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Leave Type</p>
                    <p className="text-sm bg-white p-3 rounded border border-gray-100">Vacation</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Duration</p>
                    <p className="text-sm bg-white p-3 rounded border border-gray-100">From 5/20/2025 to 5/25/2025</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => navigate('/supervisor/leave-approvals')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <Calendar size={16} />
                  <span>View All Leave Requests</span>
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'evaluations':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="text-blue-500" />
                <span>Latest Evaluation</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Amy Smith</h3>
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-800">
                    Score: 90/100
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <FiCalendar size={14} />
                    <span>April 25, 2025</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiFileText size={14} />
                    <span>Project Completion</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Feedback</p>
                    <p className="text-sm bg-white p-3 rounded border border-gray-100 italic">
                      "Excellent work on the project, demonstrated strong technical skills and teamwork."
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Badges</p>
                    <div className="flex flex-wrap gap-2 bg-white p-3 rounded border border-gray-100">
                      <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs border border-blue-200">
                        <Star className="w-4 h-4 text-blue-600" />
                        React Expert
                      </span>
                      <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs border border-blue-200">
                        <Users className="w-4 h-4 text-blue-600" />
                        Team Player
                      </span>
                      <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs border border-blue-200">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        Fast Learner
                      </span>
                      <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs border border-blue-200">
                        <ThumbsUp className="w-4 h-4 text-blue-600" />
                        Top Performer
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Supervisor</p>
                    <p className="text-sm bg-white p-3 rounded border border-gray-100">
                      Engr. Supervisor Name
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => navigate('/supervisor/performance-overview')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <FileText size={16} />
                  <span>View All Evaluations</span>
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
                <Clipboard className="text-blue-500" />
                <span>Latest Report</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Day 5 - Juan Dela Cruz</h3>
                  <StatusBadge status="Pending" />
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <FiCalendar size={14} />
                    <span>April 18, 2025</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiClock size={14} />
                    <span>Submitted 04:30 PM</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiFileText size={14} />
                    <span>Tasks: 4 | Hours: 5h</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Summary</p>
                    <p className="text-sm bg-white p-3 rounded border border-gray-100">
                      Attended training session and worked on personal project.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Tasks</p>
                    <ul className="text-sm space-y-2 bg-white p-3 rounded border border-gray-100">
                      <li className="flex items-start gap-2">
                        <span className="inline-block mt-1 w-2 h-2 rounded-full bg-yellow-500"></span>
                        <span>Training session <span className="text-xs text-gray-500">(10:00 AM)</span></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="inline-block mt-1 w-2 h-2 rounded-full bg-green-500"></span>
                        <span>Personal project <span className="text-xs text-gray-500">(1:00 PM)</span></span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Challenges</p>
                    <p className="text-sm bg-white p-3 rounded border border-gray-100">
                      Training took longer than expected.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Plans for Next Day</p>
                    <p className="text-sm bg-white p-3 rounded border border-gray-100">
                      Will catch up on missed work tomorrow.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => navigate('/supervisor/report-approvals')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg acestei-blue-100 transition-colors"
                >
                  <FiFileText size={16} />
                  <span>View All Reports</span>
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'schedule-management':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="text-blue-500" />
                <span>Schedule Management</span>
              </h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Set default check-in and check-out times for all interns for today, May 18, 2025.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Check-In Time
                    </label>
                    <input
                      type="time"
                      value={defaultCheckIn}
                      onChange={(e) => setDefaultCheckIn(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Check-Out Time
                    </label>
                    <input
                      type="time"
                      value={defaultCheckOut}
                      onChange={(e) => {
                        const checkOut = e.target.value;
                        const checkIn = defaultCheckIn;
                        if (checkOut && checkIn && checkOut <= checkIn) {
                          alert('Check-out time must be after check-in time.');
                          return;
                        }
                        setDefaultCheckOut(e.target.value);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    const updatedInternTimes = Object.fromEntries(
                      Object.keys(internTimes).map((intern) => [
                        intern,
                        {
                          checkIn: convertTo12Hour(defaultCheckIn),
                          checkOut: convertTo12Hour(defaultCheckOut),
                        },
                      ])
                    );
                    setInternTimes(updatedInternTimes);
                    alert('Default schedule applied to all interns!');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply to All Interns
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-gray-500 text-center p-6">Content not found</div>;
    }
  };

  const addTask = () => {
    if (newTask.name.trim() && newTask.time) {
      setTasks([...tasks, { id: Date.now(), name: newTask.name.trim(), time: newTask.time }]);
      setNewTask({ name: '', time: '' });
      setIsTaskModalOpen(false);
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Layout className="text-blue-500" />
            <span>Supervisor Dashboard</span>
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div 
            className="bg-blue-500 rounded-lg p-4 text-white shadow-sm cursor-pointer hover:bg-blue-600 transition-colors"
            onClick={() => navigate('/supervisor/manage-interns')}
          >
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold">12</h2>
              <p className="text-sm">Total Interns</p>
            </div>
          </div>
          <div 
            className="bg-green-500 rounded-lg p-4 text-white shadow-sm cursor-pointer hover:bg-green-600 transition-colors"
            onClick={() => navigate('/supervisor/timesheet-approvals')}
          >
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold">7</h2>
              <p className="text-sm">Timesheet Approvals</p>
            </div>
          </div>
          <div 
            className="bg-purple-500 rounded-lg p-4 text-white shadow-sm cursor-pointer hover:bg-purple-600 transition-colors"
            onClick={() => navigate('/supervisor/leave-approvals')}
          >
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold">3</h2>
              <p className="text-sm">Leave Requests</p>
            </div>
          </div>
          <div 
            className="bg-yellow-500 rounded-lg p-4 text-white shadow-sm cursor-pointer hover:bg-yellow-600 transition-colors"
            onClick={() => navigate('/supervisor/report-approvals')}
          >
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold">24</h2>
              <p className="text-sm">Report Approvals</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 col-span-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Today's Overview</h3>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
              <h2 className="text-xl font-bold text-gray-700">{interns.filter(i => i.status === 'Active').length} Interns Currently Active</h2>
            </div>
            <p className="text-gray-500 text-sm mt-1">Current Time: {formattedTime}</p>
            <div className="mt-2 flex items-center text-yellow-600 bg-yellow-50 p-2 rounded text-xs">
              <AlertTriangle size={14} className="mr-1" />
              <span>{interns.filter(i => i.status === 'Late').length} intern is currently late</span>
            </div>
            {interns.filter(i => i.status === 'Absent').length > 0 && (
              <div className="mt-2 flex items-center text-red-600 bg-red-50 p-2 rounded text-xs">
                <AlertTriangle size={14} className="mr-1" />
                <span>{interns.filter(i => i.status === 'Absent').length} intern is currently absent</span>
              </div>
            )}
          </div>
          <div className="relative">
            <div className="bg-blue-500 rounded-lg p-4 shadow-sm text-white" ref={scheduleRef}>
              <div className="text-left">
                <p className="mb-2">Today's Schedule</p>
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="mt-1 flex items-center gap-1 px-5 py-1 bg-blue-500 text-white rounded hover:bg-green-600 absolute top-2 right-2"
                >
                  <Plus size={14} />
                  <span className="hidden sm:inline">Add Task</span>
                </button>
                <div className="bg-white text-gray-800 rounded p-2 text-sm max-h-48 overflow-y-auto">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="group"
                      onMouseEnter={() => setHoveredTask(task)}
                      onMouseLeave={() => setHoveredTask(null)}
                    >
                      <div className="flex justify-between items-center px-2 py-1 hover:bg-gray-100">
                        <span className="truncate max-w-[60%]">{task.name}</span>
                        <span>{task.time}</span>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {hoveredTask && (
              <div className="absolute top-0 right-full ml-4 w-64 bg-white p-4 rounded shadow-md border border-gray-200 z-10 text-gray-800">
                <p className="text-sm"><strong>Task:</strong> {hoveredTask.name}</p>
                <p className="text-sm"><strong>Time:</strong> {hoveredTask.time}</p>
                <p className="text-sm"><strong>ID:</strong> {hoveredTask.id}</p>
              </div>
            )}
          </div>
        </div>
        {isTaskModalOpen && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
              <input
                type="text"
                placeholder="Task Name"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <input
                type="time"
                value={newTask.time ? convertTo24Hour(newTask.time).slice(0, 5) : ''}
                onChange={(e) => setNewTask({ ...newTask, time: convertTo12Hour(e.target.value) })}
                className="w-full p-2 mb-4 border border-gray-300 rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-1">
          {[
            { id: 'monitoring', name: 'Intern Monitoring', icon: BarChart2 },
            { id: 'reports', name: 'Report Approval', icon: Clipboard },
            { id: 'leave', name: 'Leave Management', icon: Calendar },
            { id: 'evaluations', name: 'Evaluations', icon: FileText },
            { id: 'schedule-management', name: 'Schedule Management', icon: Clock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm flex items-center transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <tab.icon size={16} className="mr-1" />
              {tab.name}
            </button>
          ))}
        </div>
        <TabContent />
      </main>
    </div>
  );
};

export default SupervisorDashboard;