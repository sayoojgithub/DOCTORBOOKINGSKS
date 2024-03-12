import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoute from './Routes/auth.js';
import userRoute from './Routes/user.js';
import doctorRoute from './Routes/doctor.js';
import adminRoute from './Routes/admin.js';
import bookingRoute from './Routes/Booking.js';
import ChatRoute from './Routes/Chat.js';
import MessageRoute from './Routes/Message.js';
import http from 'http';
import path from "path"
const currentWorkingDir = path.resolve();
const parentDir = path.dirname(currentWorkingDir)
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

let activeUsers = []; 

io.on("connection", (socket) => {
  // add new User
  socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });

  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const recipientSocket = activeUsers.find((user) => user.userId === receiverId);
    if (recipientSocket) {
      io.to(recipientSocket.socketId).emit("receive-message", data);
    }
  });
  socket.on('typing',(id)=>{
    io.emit('typingSend',{id})
  })
});


const port = process.env.PORT || 8000;

const corsOptions = {
  origin: true
};

// app.get('/',(req,res)=>{
//     res.send('api is working')
// });

//database connection
mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB database is connected');
    } catch (err) {
        console.log('MongoDB database connection failed');
    }
};

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api/v1/auth', authRoute);  
app.use('/api/v1/users', userRoute); 
app.use('/api/v1/doctors', doctorRoute);
app.use('/api/v1/admin', adminRoute);  
app.use('/api/v1/booking', bookingRoute);  
app.use('/api/v1/chat', ChatRoute);
app.use('/api/v1/message', MessageRoute);

const enviornment = "production"

if (enviornment === 'production') { 
    const __dirname = path.resolve();
    app.use(express.static(path.join(parentDir, '/frontend/dist')));
  
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(parentDir, 'frontend', 'dist', 'index.html'))
    );
  } else {
    app.get('/', (req, res) => {
      res.send('API is running....');
    });
  }

server.listen(port, () => {
    console.log('server is running on port' + port);
    connectDB();
});
