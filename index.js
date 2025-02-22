import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import productsRoutes from './routes/products.routes.js';
import userAuthentication from './routes/user.routes.js';
import adminAuthentication from './routes/admin.routes.js';
import orderRoutes from './routes/order.routes.js';
import sendEmail from './routes/email.routes.js';
import searchRoutes  from './routes/products.search.routes.js';

import cookieParser from 'cookie-parser';

dotenv.config()

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const allowedOrigins = [
    'https://hardayfunkeh-online-shopping.vercel.app',
    'http://localhost:5173',
];

// 'http://localhost:5174', 
// Configure CORS middleware
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow access
    } else {
        callback(new Error('Not allowed by CORS')); // Deny access
    }
},
    // credentials: true, // Allow cookies and credentials if needed
};
  
// Apply CORS middleware
app.use(cors(corsOptions));

mongoose.connect(process.env.dbs).then((response) => {
    console.log('Database Connected!');
    app.listen(process.env.PORT, () => {
        console.log(`Server is listening on port ${process.env.PORT}!`);
    });
}).catch((error) => {
    console.log(error);
});

app.get("/",(req, res,) => {
    res.send('Hello World');
});

app.use('/api/products', productsRoutes);
app.use('/api/user/auth', userAuthentication);
app.use('/api/admin/auth', adminAuthentication);
app.use('/api/order', orderRoutes);
app.use('/api/email', sendEmail);
app.use('/api/product', searchRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error!';

    return res.status(statusCode).json({
        success : false,
        statusCode,
        message
    });
});
