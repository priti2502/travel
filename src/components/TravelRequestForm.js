import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; 
import './TravelRequestForm.css';
import { jwtDecode } from 'jwt-decode';

const AddTravelRequestPage = () => {
    const { requestId } = useParams(); 
    const [formData, setFormData] = useState({
        userId: '', 
        firstName: '',
        lastName: '',
        projectId: '',
        departmentId: '',
        reasonForTravel: '',
        fromDate: '',
        toDate: '',
        fromLocation: '',
        toLocation: ''
    });

    const [projects, setProjects] = useState([]);
    const [departments, setDepartments] = useState([]);
    const navigate = useNavigate();
    const isEditMode = !!requestId; 

    useEffect(() => {
      
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setFormData(prevState => ({
                ...prevState,
                userId: decodedToken.userid,
                firstName: decodedToken.firstname,
                lastName: decodedToken.lastname,
                departmentId: decodedToken.departmentid,
            }));
        }

        // Fetch projects
        axios.get('https://localhost:7075/api/Project')
            .then(response => setProjects(response.data))
            .catch(error => console.error('Error fetching projects:', error));

        // Fetch departments
        axios.get('https://localhost:7075/api/Department')
            .then(response => setDepartments(response.data))
            .catch(error => console.error('Error fetching departments:', error));

        // If editing, fetch the travel request details to prefill the form
        if (isEditMode) {
          console.log(requestId)
            axios.get(`https://localhost:7075/api/TravelRequest/${requestId}`)
                .then(response => {
                    const request = response.data;
                    console.log(response.data)
                    setFormData({
                        userId: request.userId,
                        firstName: request.firstName,
                        lastName: request.lastName,
                        projectId: request.projectId,
                        departmentId: request.departmentId,
                        reasonForTravel: request.reasonForTravel,
                        fromDate: request.fromDate,
                        toDate: request.toDate,
                        fromLocation: request.fromLocation,
                        toLocation: request.toLocation
                    });
                })
                .catch(error => console.error('Error fetching travel request:', error));
        }
    }, [requestId, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const requestData = {
            userId: formData.userId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            projectId: formData.projectId,
            departmentId: formData.departmentId,
            reasonForTravel: formData.reasonForTravel,
            fromDate: formData.fromDate,
            toDate: formData.toDate,
            fromLocation: formData.fromLocation,
            toLocation: formData.toLocation
        };

        // If editing, send a PUT request; otherwise, POST for a new request
        const apiUrl = isEditMode 
            ? `https://localhost:7075/api/TravelRequest/${requestId}` // PUT for editing
            : 'https://localhost:7075/api/TravelRequest'; // POST for new request

        const requestMethod = isEditMode ? axios.put : axios.post;

        requestMethod(apiUrl, requestData)
            .then(response => {
                alert(isEditMode ? 'Travel Request updated successfully!' : 'Travel Request submitted successfully!');
                navigate('/dashboard/employee'); // Redirect to the Employee Dashboard
            })
            .catch(error => {
                console.error('There was an error submitting the travel request!', error);
            });
    };

    return (
        <div className='add-travel-request-page'>
            <h2>{isEditMode ? 'Edit Travel Request' : 'Add Travel Request'}</h2>
            <form className="travel-request-form" onSubmit={handleSubmit}>
              
                <label>
                    User ID:
                    <input type="text" name="userId" value={formData.userId} onChange={handleChange} readOnly />
                </label>
                <label>
                    First Name:
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} readOnly />
                </label>
                <label>
                    Last Name:
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} readOnly />
                </label>
                <label>
                    Department:
                    <select name="departmentId" value={formData.departmentId} onChange={handleChange} required>
                        <option value="">Select a department</option>
                        {departments.map(department => (
                            <option key={department.departmentId} value={department.departmentId}>
                                {department.departmentName}
                            </option>
                        ))}
                    </select>
                </label>
                
                <label>
                    Project:
                    <select name="projectId" value={formData.projectId} onChange={handleChange} required>
                        <option value="">Select a project</option>
                        {projects.map(project => (
                            <option key={project.projectId} value={project.projectId}>
                                {project.projectName}
                            </option>
                        ))}
                    </select>
                </label>

               

              
                <label>
                    Reason for Travel:
                    <input name="reasonForTravel" value={formData.reasonForTravel} onChange={handleChange} required />
                </label>
                <label>
                    From Date:
                    <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} required />
                </label>
                <label>
                    To Date:
                    <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} required />
                </label>
                <label>
                    From Location:
                    <input type="text" name="fromLocation" value={formData.fromLocation} onChange={handleChange} required />
                </label>
                <label>
                    To Location:
                    <input type="text" name="toLocation" value={formData.toLocation} onChange={handleChange} required />
                </label>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button type="submit" >{isEditMode ? 'Update Request' : 'Submit Request'}</button>
                    <button type="button" onClick={() => navigate('/dashboard/employee')}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AddTravelRequestPage;
