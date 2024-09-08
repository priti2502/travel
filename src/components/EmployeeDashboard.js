import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Fix import statement
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const [travelRequests, setTravelRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userid;

      axios
        .get(`https://localhost:7075/api/TravelRequest/user/${userId}`)
        .then((response) => setTravelRequests(response.data))
        .catch((error) =>
          console.error("Error fetching travel requests:", error)
        );
    }
  }, []);

  const handleDownloadTicket = async (requestId) => {
    try {
      const response = await axios.get(
        `https://localhost:7075/api/TravelRequest/DownloadTicket/${requestId}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ticket_${requestId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the ticket:", error);
      alert("Error downloading the ticket.");
    }
  };
  const handleEdit = (requestId) => {
    navigate(`/edit-travel-request/${requestId}`);
  };

  return (
    <div className="employee">
      <h1>
        <span className="title-emp">Employee Dashboard</span>
      </h1>
      <button
        className="create-request-button"
        onClick={() => navigate("/new-travel-request")}
      >
        Create New Travel Request
      </button>

      <div className="travel-request-history">
        <h2>
          <span className="title">Travel Request History</span>
        </h2>
        <table className="travel-history-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Project</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {travelRequests.map((request) => (
              <tr key={request.travelRequestId}>
                <td>{request.travelRequestId}</td>
                <td>{request.project.projectName}</td>
                <td>
                  {request.fromLocation} on{" "}
                  {new Date(request.fromDate).toDateString()}
                </td>
                <td>
                  {request.toLocation} on{" "}
                  {new Date(request.toDate).toDateString()}
                </td>
                <td>{request.reasonForTravel}</td>
                <td>{request.status}</td>
                <td>{request.comments}</td>
                <td>
                  {["Rejected", "Returned to Employee"].includes(
                    request.status
                  ) ? (
                    <button className='edit' onClick={() => handleEdit(request.travelRequestId)}>Edit</button>
                  ) : request.status === "Booked" ? (
                    <button
                      className="downloadBtn"
                      onClick={() => handleDownloadTicket(request.travelRequestId)}
                    >
                      Download Ticket
                    </button>
                  ) : [
                      "Pending",
                      "Completed",
                      "Updated",
                      "ReturnedToManager",
                    ].includes(request.status) ? (
                    <span>No action available</span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
