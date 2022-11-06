class Article {
  readonly title: string;

  readonly link: string;

  readonly published: number;

  constructor(
    parsedArticle: { title: string, link: string, published: number},
  ) {
    this.title = parsedArticle.title;
    this.link = parsedArticle.link;
    this.published = parsedArticle.published;
  }
}

export default Article;
