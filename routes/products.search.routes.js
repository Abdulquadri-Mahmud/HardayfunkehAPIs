import express from 'express';
import { searchProducts } from '../controller/product.search.controller';

const app = express();

app.get("/search", searchProducts); // Route for searching products

export default app;
