import React from 'react';
import './UserTable.css';

const UserTable = ({ users, deleteUser, editUser }) => (
  <table className="user-table">
    <thead>
      <tr>
        <th>User ID</th>
        <th>Email</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Department</th>
        <th>Manager Name</th>
        <th>Role</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        <tr key={user.userId}>
          <td>{user.userId}</td>
          <td>{user.email}</td>
          <td>{user.firstName}</td>
          <td>{user.lastName}</td>
          <td>{user.department?.departmentName || 'N/A'}</td>
          <td>{user.manager ? `${user.manager.firstName} ${user.manager.lastName}` : 'N/A'}</td>
          <td>{user.role?.roleName || 'N/A'}</td>
          <td>
            <button className="edit-button" onClick={() => editUser(user)}>Edit</button>
            <button className="delete-button" onClick={() => deleteUser(user.userId)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default UserTable;
