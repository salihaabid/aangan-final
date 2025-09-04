// import { Server } from 'socket.io';
// import http from 'http';
// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config';
// import connectDB from './config/mongodb.js';
// import connectCloudinary from './config/cloudinary.js';
// import userRouter from './routes/userRouter.js';
// import productRouter from './routes/productRouter.js';
// import cartRouter from './routes/cartRouter.js';
// import orderRouter from './routes/orderRouter.js';

// const app = express();
// const server = http.createServer(app); // wrap express in http server
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:5173', // ✅ Vite frontend
//     methods: ['GET', 'POST'],
//   },
// });

// const PORT = process.env.PORT || 5000;
// connectDB();
// connectCloudinary();

// app.use(
//   cors({
//     origin: 'http://localhost:5173', // ✅ also fix CORS middleware
//   })
// );
// app.use(express.json());

// app.use('/api/user', userRouter);
// app.use('/api/product', productRouter);
// app.use('/api/cart', cartRouter);
// app.use('/api/order', orderRouter);

// app.get('/', (req, res) => {
//   res.send('✅ Server is running fine!');
// });

// io.on('connection', (socket) => {
//   console.log('🔥 New client connected:', socket.id);

//   socket.on('newReview', (review) => {
//     io.emit('newReview', review); // broadcast to everyone
//   });

//   socket.on('disconnect', () => {
//     console.log('❌ Client disconnected:', socket.id);
//   });
// });

// server.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
// });

import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import orderRouter from './routes/orderRouter.js';

const app = express();
const server = http.createServer(app); // wrap express in http server

// ✅ Define allowed origins (frontend + admin + localhost for dev)
const allowedOrigins = [
  'http://localhost:5173', // local frontend
  'http://localhost:5174', // local admin (if running separately)
  process.env.FRONTEND_URL, // deployed frontend (Vercel)
  process.env.ADMIN_URL, // deployed admin panel (Vercel)
].filter(Boolean); // removes undefined if env vars aren’t set
console.log('Allowed origins:', allowedOrigins);
// ✅ Normal CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

connectDB();
connectCloudinary();

// ✅ API routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/', (req, res) => {
  res.send('✅ Server is running fine!');
});

// ✅ Socket.io with same CORS config
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('🔥 New client connected:', socket.id);

  socket.on('newReview', (review) => {
    io.emit('newReview', review); // broadcast to everyone
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
