import React, { useState, useEffect } from 'react';
import './UserForm.css';

 

const UserForm = ({ user, handleInputChange, buttonText, onSubmit, onClose, roles, departments, managers }) => (
  <form
    className="user-form"
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
  >
    <input
      type="email"
      value={user.email || ''}
      onChange={(e) => handleInputChange(e, 'email')}
      placeholder="Email"
      required
    />
    <input
      type="text"
      value={user.firstName || ''}
      onChange={(e) => handleInputChange(e, 'firstName')}
      placeholder="First Name"
      required
    />
    <input
      type="text"
      value={user.lastName || ''}
      onChange={(e) => handleInputChange(e, 'lastName')}
      placeholder="Last Name"
    />
    <input
      type="text"
      value={user.address || ''}
      onChange={(e) => handleInputChange(e, 'address')}
      placeholder="Address"
    />
    <input
      type="password"
      value={user.password || ''}
      onChange={(e) => handleInputChange(e, 'password')}
      placeholder="Password"
    />
    <input
      type="tel"
      value={user.mobileNum || ''}
      onChange={(e) => handleInputChange(e, 'mobileNum')}
      placeholder="Mobile Number"
      required
    />
    <select
      value={user.departmentId || ''}
      onChange={(e) => handleInputChange(e, 'departmentId')}
    >
      <option value="">Select Department</option>
      {departments.map(dept => (
        <option key={dept.departmentId} value={dept.departmentId}>
          {dept.departmentName}
        </option>
      ))}
    </select>
    <select
      value={user.roleId || ''}
      onChange={(e) => handleInputChange(e, 'roleId')}
    >
      <option value="">Select Role</option>
      {roles.map(role => (
        <option key={role.roleId} value={role.roleId}>
          {role.roleName}
        </option>
      ))}
    </select>
    {user.roleId !== 'Manager' && (
      <select
        value={user.managerId || ''}
        onChange={(e) => handleInputChange(e, 'managerId')}
      >
        <option value="">Select Manager</option>
        {managers.map(manager => (
          <option key={manager.userId} value={manager.userId}>
            {manager.firstName} {manager.lastName}
          </option>
        ))}
      </select>
    )}
    <div>
    <button type="submit" className="submit-button">{buttonText}</button>
      <button type="button" className="cancel-button" onClick={onClose}>
        Cancel
      </button>
      </div>
   
  </form>
);
export default UserForm;
 