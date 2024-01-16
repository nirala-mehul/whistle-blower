// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {GeneratePseudonym} from "./GeneratePseudonym";
import path from "path";

dotenv.config();

const app: Express = express();

app.use(express.static(path.join(__dirname, '../whistleblower-frontend', 'build')))

app.get("/api/pseudonym", (req: Request, res: Response) => {
  const address: string | undefined = req.query.address?.toString();

  if (address){
    res.send(GeneratePseudonym(address));
  }
  else {
    res.sendStatus(400);
  }
});

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../whistleblower-frontend', 'build', 'index.html'))
})


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
