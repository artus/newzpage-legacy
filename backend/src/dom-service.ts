import { JSDOM } from "jsdom";
import { Optional } from "./control-structures";

export class DomService {

  public async getPageContent(url: string, page: string): Promise<Optional<string>> {
    const jsdom = new JSDOM(page, { 
      url,
      runScripts: "outside-only" 
    });

    const document = jsdom.window.document.querySelector('main') || jsdom.window.document;

    const relevantNodes = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li');

    if (!relevantNodes) {
      return Optional.empty();
    }

    let content = "";

    for (const node of relevantNodes) {
      content += node.textContent;
    }

    return Optional.of(content);
  }
}