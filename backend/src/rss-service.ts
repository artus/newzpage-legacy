import { parse } from "rss-to-json";

interface ParsedItem {
  title: string;
  link: string;
  published: number;
  summary: string;
}

interface ParsedFeed {
  title: string;
  link: string;
  items: Array<ParsedItem>
}

export class RssService {

  public async getRss(url: string) {
    const response = await parse(url);
    return response as ParsedFeed;
  }

}
