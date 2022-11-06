import express, { Express } from "express";
import cors from "cors";
import { getRss } from "./rss-service";
import { getSummary } from "./summary-service";

export const routes = (app: Express) => {
  app.get('/api/rss', async (req, res) => {
    try {
      const link = req.query.link as string;
      const rss = await getRss(link);
      res.json(rss);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.get('/api/summary', async (req, res) => {
    try {
      const link = req.query.link as string;
      const summary = await getSummary(link);
      res.json({ summary });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  })

  return app;
}
const app = express();
app.use(cors());
routes(app);

app.listen(8080, () => {
  console.log('Listening on port 8080');
});