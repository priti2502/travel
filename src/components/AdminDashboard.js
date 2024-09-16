import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import UserTable from './UserTable';
import UserForm from './UserForm';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', roleId: '', firstName: '', lastName: '', departmentId: '', managerId: '', address: '', mobileNum: '', password: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, rolesResponse, departmentsResponse, managersResponse] = await Promise.all([
        axios.get('https://localhost:7075/api/User/users'),
        axios.get('https://localhost:7075/api/Role'),
        axios.get('https://localhost:7075/api/Department'),
        axios.get('https://localhost:7075/api/User/managers')
      ]);
      setUsers(usersResponse.data.reverse()); 
      setRoles(rolesResponse.data);
      setDepartments(departmentsResponse.data);
      setManagers(managersResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Failed to fetch data.');
    }
  };

  const handleInputChange = (e, field) => {
    setNewUser(prev => ({ ...prev, [field]: e.target.value }));
  };

  const addUser = async () => {
    if (!newUser.email || !newUser.roleId) {
      setMessage('Please fill in all required fields.');
      return;
    }

    try {
      await axios.post('https://localhost:7075/api/User/users', newUser);
      await fetchData(); 

      
      setNewUser({ email: '', roleId: '', firstName: '', lastName: '', departmentId: '', managerId: '', address: '', mobileNum: '', password: '' });
      setShowAddForm(false);
      setEditMode(false);
      setMessage('User added successfully.');
    } catch (error) {
      console.error('Error adding user:', error.response?.data || error.message);
      setMessage('Failed to add user. Please try again.');
    }
  };

  const editUser = async () => {
    if (!newUser.email || !newUser.roleId || !newUser.departmentId || !newUser.address || !newUser.mobileNum || !newUser.password) {
      setMessage('Please fill in all required fields.');
      return;
    }

    const payload = {
      userId: newUser.userId,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      roleId: newUser.roleId,
      departmentId: newUser.departmentId,
      managerId: newUser.managerId || null,
      address: newUser.address,
      mobileNum: newUser.mobileNum,
      password: newUser.password,
    };

    try {
      console.log('Request payload:', payload);
      await axios.put(`https://localhost:7075/api/User/users/${newUser.userId}`, payload);
      await fetchData(); 

      setNewUser({ email: '', roleId: '', firstName: '', lastName: '', departmentId: '', managerId: '', address: '', mobileNum: '', password: '' });
      setShowAddForm(false);
      setEditMode(false);
      setMessage('User updated successfully.');
    } catch (error) {
      console.error('Error updating user:', error.response?.data?.errors || error.message);
      setMessage('Failed to update user. Please check the required fields.');
    }
  };

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://localhost:7075/api/User/users/${userId}`);
      await fetchData(); 
      setMessage('User deleted successfully.');
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage('Failed to delete user. Please try again.');
    }
  };

  const handleEdit = (user) => {
    setNewUser(user);
    setShowAddForm(true);
    setEditMode(true);
  };

  const handleAdd = () => {
    setNewUser({ email: '', roleId: '', firstName: '', lastName: '', departmentId: '', managerId: '', address: '', mobileNum: '', password: '' });
    setShowAddForm(true);
    setEditMode(false);
  };

  const filteredUsers = users.filter(user => {
    return (
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="admin-dashboard">
     <h1><span className='title'>Admin Dashboard</span></h1>
      {!showAddForm && (
        <div className="controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button name='addUser' className="add-button" onClick={handleAdd}>Add User</button>
          <input
            type="text"
            className="search-bar"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      {showAddForm && (
        <div className="form-container">
          <UserForm
            user={newUser}
            handleInputChange={handleInputChange}
            buttonText={editMode ? "Update User" : "Add User"}
            onSubmit={editMode ? editUser : addUser}
            onClose={() => {
              setShowAddForm(false);
              setEditMode(false);
            }}
            roles={roles}
            departments={departments}
            managers={managers}
          />
        </div>
      )}
      <UserTable
        users={filteredUsers}
        deleteUser={deleteUser}
        editUser={handleEdit}
      />
    </div>
  );
}

export default AdminDashboard;
