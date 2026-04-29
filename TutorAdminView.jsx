import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function TutorAdminView() {
  const [tutors, setTutors] = useState([]);
  const [total, setTotal] = useState(0);

  const [name, setName] = useState('');
  const [status, setStatus] = useState('active');

  // Load tutors on mount
  useEffect(() => {
    fetch('http://localhost:3000/api/admin/tutors')
      .then(res => res.json())
      .then(data => {
        setTutors(data.tutors);
        setTotal(data.total);
      });

    // Listen for real-time tutor creation
    socket.on('tutor:created', (newTutor) => {
      setTutors(prev => [...prev, newTutor]);
      setTotal(prev => prev + 1);
    });

    return () => socket.off('tutor:created');
  }, []);

  const addTutor = async (e) => {
    e.preventDefault();

    await fetch('http://localhost:3000/api/admin/tutors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, status })
    });

    setName('');
    setStatus('active');
  };

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <h1>Admin — Tutor Management</h1>

      <h2>Total Tutors: {total}</h2>

      <form onSubmit={addTutor} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Tutor name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>

        <button type="submit">Add Tutor</button>
      </form>

      <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {tutors.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.name}</td>
              <td>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
