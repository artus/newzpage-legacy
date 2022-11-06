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

export const getRss = async (link: string) => {
  const response = await parse(link);
  return response as ParsedFeed;
}