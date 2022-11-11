import { Express } from "express";
import { RssService } from "../rss-service";

export class RssController {

  constructor(app: Express, rssService: RssService) {
    app.get('/api/rss', async (req, res) => {
      try {
        const link = req.query.link as string;
        const rss = await rssService.getRss(link);
        res.json(rss);
      } catch (error) {
        res.status(500).json({ message: (error as Error).message });
      }
    });
  }
}