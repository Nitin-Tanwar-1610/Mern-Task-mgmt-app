import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const TaskDetails = () => {
  const [task, setTask] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/tasks/${id}`);
      setTask(response.data);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  if (!task) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <header className="text-center mb-4">
        <h1 className="display-4">Task Details</h1>
        <p className="lead text-muted">View and edit task details</p>
      </header>

      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="card-title">{task.title}</h2>
          {/* <p className="card-text">{task.description}</p> */}

          <ul className="list-group list-group-flush mb-3">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span className="font-weight-bold">Due Date:</span>
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span className="font-weight-bold">Priority:</span>
              <span>{task.priority}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center">
              <span className="font-weight-bold">Status:</span>
              <span>{task.completed ? "Completed" : "Pending"}</span>
            </li>
          </ul>

          <div className="d-flex justify-content-between">
            <Link to={`/edit/${task._id}`} className="btn btn-success">
              Edit
            </Link>
            <Link to="/" className="btn btn-secondary">
              Back to List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
