import express from 'express';
import { allOrders, createOrder, deleteOrder, 
    OrderID, updateOrder 
} from '../controller/order.controller.js';

const app = express();

app.post('/create_orders', createOrder);
app.get('/orders/:id', OrderID);
app.patch('/orders/:id', updateOrder);
app.delete('/cancel_orders/:id', deleteOrder);
app.all('/all_orders', allOrders);

export default app;