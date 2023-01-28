import express, { Application, Request, Response } from "express";

const app: Application = express();
app.use(express.json());
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  return res.send("Hello :)")
});

app.post("/api/data", (req: Request, res: Response) => {
  console.log(req.body);

  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Application listening at http://localhost:${PORT}`);
});
