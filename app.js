import dotenv from 'dotenv';
import express from 'express';
import {router} from "./routes/routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(router)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});