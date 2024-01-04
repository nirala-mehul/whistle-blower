// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {GeneratePseudonym} from "./GeneratePseudonym";

dotenv.config();

const app: Express = express();

app.use(express.static('build'))

app.get("/api/pseudonym", (req: Request, res: Response) => {
  const address: string | undefined = req.query.address?.toString();

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
