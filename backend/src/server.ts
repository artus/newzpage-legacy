import express, { Express } from "express";
import cors from "cors";

import { DomService } from "./dom-service";
import { HttpService } from "./http-service";
import { InMemorySummaryRepository } from "./repository/InMemorySummaryRepository";
import { SummaryService } from "./summary-service";
import { SummaryController } from "./rest/summary-controller";
import { RssController } from "./rest/rss-controller";
import { RssService } from "./rss-service";
import { CONSTANTS } from "./constants";

const app = express();
app.use(cors());

const summaryRepository = new InMemorySummaryRepository();
const domService = new DomService();
const httpService = new HttpService();
const summaryService = new SummaryService(summaryRepository, httpService, domService);
const summaryController = new SummaryController(app, summaryService);
const rssService = new RssService();
const rssController = new RssController(app, rssService);

app.listen(CONSTANTS.PORT, () => {
  console.log(`Listening on port ${CONSTANTS.PORT}`);
});