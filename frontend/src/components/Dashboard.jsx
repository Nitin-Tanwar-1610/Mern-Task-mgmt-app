import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [taskStatus, setTaskStatus] = useState({});

  useEffect(() => {
    fetchTasks();
  }, []);

  const goToHomePage = () => {
    navigate("/");
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const priorityDistribution = {
    High: tasks.filter((task) => task.priority === "High").length,
    Medium: tasks.filter((task) => task.priority === "Medium").length,
    Low: tasks.filter((task) => task.priority === "Low").length,
  };

  const completionRate = {
    Completed: tasks.filter((task) => task.completed).length,
    Pending: tasks.filter((task) => !task.completed).length,
  };

  const pieChartData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [
          priorityDistribution.High,
          priorityDistribution.Medium,
          priorityDistribution.Low,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const lineChartData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        label: "Task Completion",
        data: [completionRate.Completed, completionRate.Pending],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const upcomingDeadlines = tasks
    .filter((task) => !task.completed && new Date(task.dueDate) > new Date())
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 5);

  const updateTaskStatus = async (taskId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          status,
        }
      );
      const updatedTasks = tasks.map((task) => {
        if (task._id === taskId) {
          return { ...task, status }; // Let's Update the local state with the new status
        }
        return task;
      });
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Dashboard</h2>

      <div className="row mb-4">
        <div className="col-md-6">
          <h3 className="mb-3" style={{ color: "green" }}>
            Task Distribution by Priority
          </h3>
          <div className="bg-light p-3 rounded shadow-sm">
            <Pie data={pieChartData} />
          </div>
        </div>

        <div className="col-md-6">
          <h3 className="mb-3" style={{ color: "green" }}>
            Task Completion Rate
          </h3>
          <div className="bg-light p-3 rounded shadow-sm">
            <Line data={lineChartData} />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <h3 className="mb-3" style={{ color: "green" }}>
            Upcoming Deadlines
          </h3>
          <ul className="list-group">
            {upcomingDeadlines.map((task) => (
              <li
                key={task._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{task.title}</span>
                <span className="badge bg-primary rounded-pill">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
                <select
                  className="form-select"
                  style={{ width: "auto" }}
                  value={taskStatus[task._id] || task.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    setTaskStatus({ ...taskStatus, [task._id]: newStatus });
                    updateTaskStatus(task._id, newStatus);
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button className="btn btn-primary mt-4" onClick={goToHomePage}>
        Back to home
      </button>
    </div>
  );
};

export default Dashboard;
