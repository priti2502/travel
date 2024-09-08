import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TravelAdminDashboard.css";

const TravelAdminDashboard = () => {
  const [travelRequests, setTravelRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTravelRequests = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7075/api/TravelAdmin/GetAllRequests"
      );
      console.log("API Response:", response.data);

      if (Array.isArray(response.data)) {
        setTravelRequests(response.data);
      } else {
        console.error("Unexpected data format:", response.data);
        setTravelRequests([]);
      }
    } catch (error) {
      console.error("Error fetching travel requests:", error);
      setTravelRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravelRequests();
  }, []);

  const handleBooking = async (id) => {
    try {
      const comments = window.prompt("Enter comments for booking:");
      if (comments === null) return; // If user cancels, do nothing

      const bookingDetails = {
        comments,
        ticketUrl: "http://example.com/ticket",
      };

      await axios.post(
        `https://localhost:7075/api/TravelAdmin/BookTicket/${id}`,
        bookingDetails
      );
      alert("Ticket booked successfully!");
      await fetchTravelRequests(); // Refresh the list
    } catch (error) {
      console.error(
        "Error booking ticket:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to book ticket.");
    }
  };

  const handleReturnToManager = async (id) => {
    try {
      const comments = window.prompt("Enter comments to return to manager:");
      if (comments === null) return; // If user cancels, do nothing

      await axios.post(
        `https://localhost:7075/api/TravelAdmin/ReturnToManager/${id}`,
        { comments }
      );
      alert("Request returned to manager successfully!");
      await fetchTravelRequests(); // Refresh the list
    } catch (error) {
      console.error(
        "Error returning request to manager:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to return request to manager.");
    }
  };

  const handleReturnToEmployee = async (id) => {
    try {
      const comments = window.prompt("Enter comments to return to employee:");
      if (comments === null) return; // If user cancels, do nothing

      await axios.post(
        `https://localhost:7075/api/TravelAdmin/ReturnToEmployee/${id}`,
        { comments }
      );
      alert("Request returned to employee successfully!");
      await fetchTravelRequests(); // Refresh the list
    } catch (error) {
      console.error(
        "Error returning request to employee:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to return request to employee.");
    }
  };

  const handleCloseRequest = async (id) => {
    try {
      const comments = window.prompt("Enter comments to close the request:");
      if (comments === null) return; // If user cancels, do nothing

      await axios.post(
        `https://localhost:7075/api/TravelAdmin/CloseRequest/${id}`,
        { comments }
      );
      alert("Request closed successfully!");
      await fetchTravelRequests(); // Refresh the list
    } catch (error) {
      console.error(
        "Error closing request:",
        error.response ? error.response.data : error.message
      );
      alert("Failed to close request.");
    }
  };

  return (
    <div className="traveladmin-dashboard">
      <h1>
        <span className="title-tr">Travel Admin Dashboard</span>
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Project</th>
              <th>Department</th>
              <th>Reason</th>
              <th>From</th>
              <th>To</th>
              <th>Comments</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {travelRequests.length > 0 ? (
              travelRequests.map((request) => (
                <tr key={request.travelRequestId}>
                  <td>{request.travelRequestId}</td>
                  <td>
                    {request.user.firstName + " " + request.user.lastName}
                  </td>
                  <td>{request.project.projectName}</td>
                  <td>{request.department.departmentName}</td>
                  <td>{request.reasonForTravel}</td>
                  <td>
                    {request.fromLocation} on{" "}
                    {new Date(request.fromDate).toDateString()}
                  </td>
                  <td>
                    {request.toLocation} on{" "}
                    {new Date(request.toDate).toDateString()}
                  </td>
                  <td>{request.comments}</td>

                  <td>{request.status}</td>
                  <td>
                    {request.status === "Completed" ? (
                      <span>No actions available</span>
                    ) : (
                      <>
                        {request.status === "Booked" ? (
                          <button
                            name="close-button"
                            className="close-button"
                            onClick={() =>
                              handleCloseRequest(request.travelRequestId)
                            }
                          >
                            Close Request
                          </button>
                        ) : (
                          <>
                            <button
                              name="book-button"
                              className="book-button"
                              onClick={() =>
                                handleBooking(request.travelRequestId)
                              }
                            >
                              Book Ticket
                            </button>
                            <button
                              name="return-manager-button"
                              className="return-manager-button"
                              onClick={() =>
                                handleReturnToManager(request.travelRequestId)
                              }
                            >
                              Return to Manager
                            </button>
                            <button
                              name="return-employee-button"
                              className="return-employee-button"
                              onClick={() =>
                                handleReturnToEmployee(request.travelRequestId)
                              }
                            >
                              Return to Employee
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13">No travel requests available.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TravelAdminDashboard;
