const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory users
let tutors = [
  { id: 1, name: "Sarah Miller", status: "active" },
  { id: 2, name: "Daniel Ross", status: "active" }
];

// Get tutors
app.get("/api/admin/tutors", (req, res) => {
  res.json({ total: tutors.length, tutors });
});

// Add tutor
app.post("/api/admin/tutors", (req, res) => {
  const { name, status } = req.body;
  const newTutor = {
    id: tutors.length + 1,
    name,
    status
  };

  tutors.push(newTutor);

  io.emit("tutor:created", newTutor);

  res.status(201).json(newTutor);
});

io.on("connection", () => {
  console.log("Admin connected");
});

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});

