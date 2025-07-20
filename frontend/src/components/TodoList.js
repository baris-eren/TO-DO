import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

function TodoList({ token, setToken }) {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`, config);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setToken('');
      }
    }
  };

  const addTask = async e => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/tasks`, { text }, config);
      setTasks(prev => [...prev, res.data]);
      setText('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async id => {
    const task = tasks.find(t => t._id === id);
    try {
      const res = await axios.put(`${API_URL}/tasks/${id}`, { completed: !task.completed }, config);
      setTasks(tasks.map(t => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async id => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, config);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const logout = () => setToken('');

  return (
    <div className="todo-container">
      <header>
        <h2>ToDo List</h2>
        <button className="logout-btn" onClick={logout}>Çıkış Yap</button>
      </header>

      <form onSubmit={addTask} className="add-form">
        <input
          type="text"
          placeholder="Yeni görev ekle..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button type="submit">Ekle</button>
      </form>

      <div className="filters">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          Tümü
        </button>
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Aktif
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Tamamlanan
        </button>
      </div>

      <ul className="task-list">
        {filteredTasks.map(task => (
          <li key={task._id} className={task.completed ? 'completed' : ''}>
            <span onClick={() => toggleComplete(task._id)} className="task-text">
              {task.text} <small>{new Date(task.date).toLocaleDateString()}</small>
            </span>
            <button className="delete-btn" onClick={() => deleteTask(task._id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
