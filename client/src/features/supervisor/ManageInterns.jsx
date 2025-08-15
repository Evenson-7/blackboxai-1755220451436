import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiUser, FiTrash2, FiPlus, FiMail, FiKey, FiEdit, FiSearch, FiArrowUp, FiArrowDown, FiImage } from 'react-icons/fi';

const ManageInterns = () => {
  const navigate = useNavigate();
  const [interns, setInterns] = useState([]);
  const [newIntern, setNewIntern] = useState({ name: '', email: '', password: '', photo: '' });
  const [editIntern, setEditIntern] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null); // Ref for the file input

  const defaultInterns = [
    { id: 1, name: 'John Doe', email: 'intern1@ojt.com', password: 'intern123', role: 'intern', photo: '' },
    { id: 2, name: 'Jane Smith', email: 'intern2@ojt.com', password: 'intern123', role: 'intern', photo: '' },
    { id: 3, name: 'Mike Johnson', email: 'intern3@ojt.com', password: 'intern123', role: 'intern', photo: '' },
  ];

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'supervisor') {
      navigate('/');
      toast.error('Access denied. Supervisor login required.');
    }

    setIsLoading(true);
    const storedUsers = JSON.parse(localStorage.getItem('users'));
    if (!storedUsers || storedUsers.length === 0) {
      const defaultUsers = [
        ...defaultInterns,
        { id: 4, name: 'Admin Supervisor', email: 'supervisor@ojt.com', password: 'admin123', role: 'supervisor', photo: '' }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
      setInterns(defaultInterns);
    } else {
      setInterns(storedUsers.filter(user => user.role === 'intern'));
    }
    setIsLoading(false);
  }, [navigate]);

  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditIntern(prev => ({ ...prev, [name]: value }));
    } else {
      setNewIntern(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoUpload = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (isEdit) {
        setEditIntern(prev => ({ ...prev, photo: reader.result }));
      } else {
        setNewIntern(prev => ({ ...prev, photo: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddIntern = (e) => {
    e.preventDefault();
    if (!newIntern.name || !newIntern.email || !newIntern.password) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!validateEmail(newIntern.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (newIntern.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    if (storedUsers.some(user => user.email === newIntern.email)) {
      toast.error('An account with this email already exists');
      return;
    }
    if (storedUsers.some(user => user.name.toLowerCase() === newIntern.name.toLowerCase())) {
      toast.error('An account with this name already exists');
      return;
    }

    const newInternWithId = {
      ...newIntern,
      id: Date.now(),
      role: 'intern'
    };

    const updatedUsers = [...storedUsers, newInternWithId];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setInterns(updatedUsers.filter(user => user.role === 'intern'));
    toast.success('Intern added successfully!');
    setNewIntern({ name: '', email: '', password: '', photo: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input
    }
  };

  const handleEditIntern = (e) => {
    e.preventDefault();
    if (!editIntern.name || !editIntern.email || !editIntern.password) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!validateEmail(editIntern.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (editIntern.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const otherUsers = storedUsers.filter(user => user.id !== editIntern.id);
    if (otherUsers.some(user => user.email === editIntern.email)) {
      toast.error('An account with this email already exists');
      return;
    }
    if (otherUsers.some(user => user.name.toLowerCase() === editIntern.name.toLowerCase())) {
      toast.error('An account with this name already exists');
      return;
    }

    const updatedUsers = [...otherUsers, editIntern];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setInterns(updatedUsers.filter(user => user.role === 'intern'));
    toast.success('Intern updated successfully!');
    setEditIntern(null);
  };

  const handleDeleteIntern = (id) => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = storedUsers.filter(user => user.id !== id);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setInterns(updatedUsers.filter(user => user.role === 'intern'));
    toast.success('Intern removed successfully!');
    setShowDeleteConfirm(null);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedInterns = useMemo(() => {
    let filtered = interns.filter(intern =>
      intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortConfig.key) {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [interns, searchTerm, sortConfig]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
              <FiUser className="text-blue-500"/>
              <span>Manage Interns</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-8 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <FiPlus className="text-blue-600" size={20} />
            <span>{editIntern ? 'Edit Intern' : 'Add New Intern'}</span>
          </h2>
          <form onSubmit={editIntern ? handleEditIntern : handleAddIntern} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiUser size={16} />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={editIntern ? editIntern.name : newIntern.name}
                  onChange={(e) => handleInputChange(e, !!editIntern)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiMail size={16} />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={editIntern ? editIntern.email : newIntern.email}
                  onChange={(e) => handleInputChange(e, !!editIntern)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiKey size={16} />
                  <span>Password</span>
                </label>
                <input
                  type="text"
                  name="password"
                  value={editIntern ? editIntern.password : newIntern.password}
                  onChange={(e) => handleInputChange(e, !!editIntern)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div className="md:col-span-3">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiImage size={16} />
                  <span>Profile Photo (Optional)</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {(editIntern ? editIntern.photo : newIntern.photo) ? (
                      <img
                        src={editIntern ? editIntern.photo : newIntern.photo}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="text-gray-400" size={24} />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={(e) => handlePhotoUpload(e, !!editIntern)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    ref={fileInputRef}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                disabled={isLoading}
              >
                <FiPlus size={16} />
                <span>{editIntern ? 'Update Intern' : 'Add Intern'}</span>
              </button>
              {editIntern && (
                <button
                  type="button"
                  onClick={() => setEditIntern(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-3">
              <FiUser className="text-blue-600" size={20} />
              <span>Current Interns ({filteredAndSortedInterns.length})</span>
            </h2>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search interns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading interns...</p>
            </div>
          ) : filteredAndSortedInterns.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No interns found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                      Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <FiArrowUp className="inline" /> : <FiArrowDown className="inline" />)}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('email')}>
                      Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? <FiArrowUp className="inline" /> : <FiArrowDown className="inline" />)}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedInterns.map((intern) => (
                    <tr key={intern.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          {intern.photo ? (
                            <img
                              src={intern.photo}
                              alt={intern.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FiUser className="text-gray-400" size={20} />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{intern.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{intern.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditIntern(intern)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <FiEdit size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(intern.id)}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          >
                            <FiTrash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this intern? This action cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteIntern(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageInterns;