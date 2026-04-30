const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

// In-memory database
let users = [
  { id: 1, name: 'Sarah Miller', role: 'student', status: 'active' },
  { id: 2, name: 'Daniel Ross', role: 'tutor', status: 'active' },
  { id: 3, name: 'Priya Kumar', role: 'student', status: 'suspended' },
  { id: 4, name: 'Alex Johnson', role: 'tutor', status: 'active' }
];

// ADMIN: Get tutors only
app.get('/api/admin/tutors', (req, res) => {
  const tutors = users.filter(u => u.role === 'tutor');
  res.json({ total: tutors.length, tutors });
});

// ADMIN: Add a tutor
app.post('/api/admin/tutors', (req, res) => {
  const { name, status } = req.body;

  const newTutor = {
    id: users.length + 1,
    name,
    role: 'tutor',
    status
  };

  users.push(newTutor);

  // Notify all admin dashboards
  io.emit('tutor:created', newTutor);

  res.status(201).json(newTutor);
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('Admin connected:', socket.id);
});

server.listen(4000, () => console.log('Server running on port 4000'));

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;

  // Simple demo login (replace with real DB check)
  if (email === "admin@tmplace.com" && password === "admin123") {
  //  return window.location.href = "about.html";
    return res.json({ message: "Login successful" });    
  }

  res.status(401).json({ message: "Invalid email or password" });
});


