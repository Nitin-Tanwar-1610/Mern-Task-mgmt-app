import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [sortBy, setSortBy] = useState("dueDate");
  const [searchTerm, setSearchTerm] = useState(""); // New state variable for search term

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
  });

  // Filter tasks based on search term
  const filteredTasks = sortedTasks.filter((task) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      task.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      task.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  return (
    <div className="container mt-4">
      <h2 className="display-7 mb-3" style={{ color: "green" }}>
        Task List
      </h2>
      <div className="mb-4">
        <label className="mr-2">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="form-select"
        >
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="mr-2">Search:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
          placeholder="Search by title or description"
        />
      </div>
      <ul className="list-group">
        {filteredTasks.map((task) => (
          <li key={task._id} className="list-group-item">
            <h3 className="h5">{task.title}</h3>
            <p>Desc: {task.description}</p>
            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p>Priority: {task.priority}</p>
            <div className="mt-2">
              <Link to={`/task/${task._id}`} className="btn btn-link">
                View
              </Link>
              <Link
                to={`/edit/${task._id}`}
                className="btn btn-link text-success"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(task._id)}
                className="btn btn-link text-danger"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <Link to="/create" className="btn btn-primary mt-4">
        Create New Task
      </Link>

      <Link to="/dashboard" className="btn btn-success mt-4 ms-4">
        View Dashboard
      </Link>
    </div>
  );
};

export default TaskList;
