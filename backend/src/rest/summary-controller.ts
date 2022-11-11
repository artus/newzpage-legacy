import { Express } from "express";
import { CONSTANTS } from "../constants";
import { SummaryService } from "../summary-service";

export class SummaryController {

  constructor(app: Express, summaryService: SummaryService) {

    app.get('/api/summary', async (req, res) => {
      try {
        const link = req.query.link as string;
        const limit = req.query.limit 
          ? parseInt(req.query.limit as string)
          : CONSTANTS.DEFAULT_SENTENCE_LIMIT;
        const summary = await summaryService.getSummary(link, limit);
        res.json({ summary });
      } catch (error) {
        res.status(500).json({ message: (error as Error).message });
      }
    })
  }
}