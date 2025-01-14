import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import TaskDetails from "./components/TaskDetails";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <Router>
      <div className="container-fluid mx-auto p-4" style={{ width: "100vw" }}>
        <h1 className="text-3xl font-bold mb-4 text-center">
          Task Management App
        </h1>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/create" element={<TaskForm />} />
          <Route path="/edit/:id" element={<TaskForm />} />
          <Route path="/task/:id" element={<TaskDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
