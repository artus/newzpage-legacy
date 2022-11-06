import * as validator from 'valivalue';
import Article from './Article';

interface ParsedItem {
  title: string;
  link: string;
  published: number;
}

interface ParsedFeed {
  title: string;
  link: string;
  items: Array<ParsedItem>;
}

class Feed {
  readonly link;

  readonly api;

  private parsedFeed: ParsedFeed | undefined;

  constructor(
    link: string,
    api: string,
  ) {
    validator.chainable(true)
      .objects.validateNotNullOrUndefined(link, 'Feed link')
      .objects.validateNotNullOrUndefined(api, 'Feed api');

    this.link = link;
    this.api = api;
  }

  private async getParsedFeed(): Promise<ParsedFeed> {
    if (!this.parsedFeed) {
      const proxiedLink = `${this.api}/api/rss?link=${this.link}`;
      const response = await fetch(proxiedLink);
      if (!response.ok) {
        throw new Error(`Failed to load feed for "${this.link}"!`);
      }
      this.parsedFeed = await response.json();
    }
    return this.parsedFeed!;
  }

  async getTitle(): Promise<string> {
    return (await this.getParsedFeed()).title;
  }

  async getLink(): Promise<string> {
    return (await this.getParsedFeed()).link;
  }

  async getArticles(): Promise<Array<Article>> {
    return (await this.getParsedFeed()).items.map((item) => new Article(item));
  }
}

export default Feed;
