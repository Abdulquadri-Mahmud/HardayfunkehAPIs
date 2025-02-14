import express from 'express';
import { sendContactEmail } from '../controller/Email.controller.js';

const app = express();

app.post('/send-email', sendContactEmail);

export default app;