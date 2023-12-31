// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {GeneratePseudonym} from "./GeneratePseudonym";

dotenv.config();

const app: Express = express();

// Define the allowed origins (replace these with your actual allowed origins)
const allowedOrigins = ['https://effective-funicular-rvpxg5xj7gg3gpr.github.dev/'];

// Middleware to check if the request origin is allowed
const allowSpecificOrigins = (req: Request, res: Response, next: any) => {
  const origin = req.get('origin');
  const isAllowed = allowedOrigins.some((allowedOrigin) =>  origin != undefined && origin.startsWith(allowedOrigin));

  if (isAllowed && origin != undefined) {
    // Allow the request from the specified origin
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  } else {
    // Deny the request if the origin is not allowed
    res.status(403).json({ error: 'Origin not allowed' });
  }
};

// Use the middleware for all routes
app.use(allowSpecificOrigins);


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/pseudonym", (req: Request, res: Response) => {
  const address: string | undefined = req.query.address?.toString();
  console.log(address);

  if (address){
    res.send(GeneratePseudonym(address));
  }
  else {
    res.sendStatus(400);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
