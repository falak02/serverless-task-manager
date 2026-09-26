import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://mjwny53155.execute-api.eu-north-1.amazonaws.com";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editDueDate, setEditDueDate] = useState("");

  // =========================
  // GET TASKS
  // =========================

  const getTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();

      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error getting tasks:", error);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  // =========================
  // ADD TASK
  // =========================

  const addTask = async () => {
    if (!title.trim()) {
      alert("Please enter a task.");
      return;
    }

    try {
      await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          priority,
          dueDate,
          completed: false,
        }),
      });

      setTitle("");
      setPriority("Medium");
      setDueDate("");

      getTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // =========================
  // DELETE TASK
  // =========================

  const deleteTask = async (taskId) => {
    try {
      await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
      });

      getTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // =========================
  // UPDATE TASK
  // =========================

  const updateTask = async () => {
    if (!editTitle.trim()) {
      alert("Task title cannot be empty.");
      return;
    }

    try {
      await fetch(`${API_URL}/tasks/${editingTask}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          priority: editPriority,
          dueDate: editDueDate,
        }),
      });

      setEditingTask(null);
      setEditTitle("");
      setEditPriority("Medium");
      setEditDueDate("");

      getTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // =========================
  // MARK COMPLETE
  // =========================

  const toggleComplete = async (task) => {
    try {
      await fetch(`${API_URL}/tasks/${task.taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task.title,
          priority: task.priority || "Medium",
          dueDate: task.dueDate || "",
          completed: !task.completed,
        }),
      });

      getTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // =========================
  // START EDIT
  // =========================

  const startEdit = (task) => {
    setEditingTask(task.taskId);
    setEditTitle(task.title);
    setEditPriority(task.priority || "Medium");
    setEditDueDate(task.dueDate || "");
  };

  // =========================
  // FILTER TASKS
  // =========================

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Completed" && task.completed) ||
      (statusFilter === "Pending" && !task.completed);

    const matchesPriority =
      priorityFilter === "All" ||
      (task.priority || "Medium") === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // =========================
  // STATISTICS
  // =========================

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "High"
  ).length;

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">
        <div>
          <h1>☁️ TaskFlow</h1>
          <p>Manage your tasks efficiently</p>
        </div>

        <div className="cloud-badge">
          AWS Serverless
        </div>
      </header>


      {/* STATISTICS */}

      <section className="stats">

        <div className="stat-card">
          <span>📋</span>
          <div>
            <h3>{totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <span>⏳</span>
          <div>
            <h3>{pendingTasks}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card">
          <span>✅</span>
          <div>
            <h3>{completedTasks}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <span>🔥</span>
          <div>
            <h3>{highPriorityTasks}</h3>
            <p>High Priority</p>
          </div>
        </div>

      </section>


      {/* ADD TASK */}

      <section className="add-card">

        <h2>➕ Add New Task</h2>

        <div className="form-grid">

          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">🟢 Low</option>
            <option value="Medium">🟡 Medium</option>
            <option value="High">🔴 High</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <button
            className="add-button"
            onClick={addTask}
          >
            Add Task
          </button>

        </div>

      </section>


      {/* SEARCH AND FILTER */}

      <section className="controls">

        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

      </section>


      {/* TASK LIST */}

      <section className="task-section">

        <div className="section-heading">
          <h2>My Tasks</h2>
          <span>{filteredTasks.length} tasks</span>
        </div>

        {filteredTasks.length === 0 ? (

          <div className="empty">
            <div>📭</div>
            <h3>No tasks found</h3>
            <p>Add a task or change your filters.</p>
          </div>

        ) : (

          filteredTasks.map((task) => (

            <div
              className={`task-card ${
                task.completed ? "completed" : ""
              }`}
              key={task.taskId}
            >

              <div className="task-check">

                <button
                  className={`check-button ${
                    task.completed ? "checked" : ""
                  }`}
                  onClick={() => toggleComplete(task)}
                >
                  {task.completed ? "✓" : ""}
                </button>

              </div>


              <div className="task-content">

                <h3>
                  {task.title}
                </h3>

                <div className="task-meta">

                  <span
                    className={`priority ${
                      (task.priority || "Medium").toLowerCase()
                    }`}
                  >
                    {task.priority || "Medium"}
                  </span>

                  {task.dueDate && (
                    <span className="date">
                      📅 {task.dueDate}
                    </span>
                  )}

                  <span className="status">
                    {task.completed
                      ? "Completed"
                      : "Pending"}
                  </span>

                </div>

              </div>


              <div className="task-actions">

                <button
                  className="edit"
                  onClick={() => startEdit(task)}
                  title="Edit"
                >
                  ✏️
                </button>

                <button
                  className="delete"
                  onClick={() => deleteTask(task.taskId)}
                  title="Delete"
                >
                  🗑️
                </button>

              </div>

            </div>

          ))

        )}

      </section>


      {/* EDIT MODAL */}

      {editingTask && (

        <div className="modal-overlay">

          <div className="modal">

            <h2>✏️ Edit Task</h2>

            <input
              type="text"
              value={editTitle}
              onChange={(e) =>
                setEditTitle(e.target.value)
              }
              placeholder="Task title"
            />

            <select
              value={editPriority}
              onChange={(e) =>
                setEditPriority(e.target.value)
              }
            >
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>

            <input
              type="date"
              value={editDueDate}
              onChange={(e) =>
                setEditDueDate(e.target.value)
              }
            />

            <div className="modal-buttons">

              <button
                className="cancel"
                onClick={() => setEditingTask(null)}
              >
                Cancel
              </button>

              <button
                className="save"
                onClick={updateTask}
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>

      )}


      {/* FOOTER */}

      <footer>
        <p>
          Built with React • AWS Lambda • API Gateway • DynamoDB
        </p>
      </footer>

    </div>
  );
}

export default App;