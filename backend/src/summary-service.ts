import { SummaryRepository } from "./summary-repository";
import { chainable } from "valivalue";
import { Summary } from "./summary";
import { CONSTANTS } from "./constants";
import { HttpService } from "./http-service";
import { DomService } from "./dom-service";

export class SummaryService {

  constructor(
    private readonly summaryRepository: SummaryRepository,
    private readonly httpService: HttpService,
    private readonly domService: DomService
  ) {
    chainable(true)
      .objects.validateNotNullOrUndefined(summaryRepository, "Summary repository")
      .objects.validateNotNullOrUndefined(httpService, "Http Service")
      .objects.validateNotNullOrUndefined(domService, "DOM Service");
  }

  public async getSummary(url: string, limit = CONSTANTS.DEFAULT_SENTENCE_LIMIT): Promise<string> {
    const savedSummary = await this.summaryRepository.getSummary(url);
    if (savedSummary.isPresent()) {
      return savedSummary.get().getSummary(limit);
    }


    try {
      const html = await this.httpService.getHtml(url);
      const textContent = await this.domService.getPageContent(url, html);
      if (textContent.isEmpty()) {
        return "No summary for article.";
      }
      const sentences = splitSentences(textContent.get());
      const summary = summarize(sentences, limit);
      return summary;
    } catch (error) {
      console.error(`Error while getting summary for '${url}', reason: '${(error as Error).message}'`, error as Error);
      return "No summary for article.";
    }
  }
}

const summarize = (sentences: string[], limit: number): string => {
  const wordRatings = new Map<string, number>();
  const phraseRatings = new Map<number, number>();

  const trimmed = sentences.map(sentence => sentence
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .replace(/\s{2,}/g, " ")
    .toLowerCase()
    .trim()
  );

  for (const sentence of trimmed) {
    const words = sentence.split(" ");
    for (const word of words) {
      wordRatings.set(word, (wordRatings.get(word) || 0) + 1);
    }
  }

  for (const [index, sentence] of trimmed.entries()) {
    let rating = 0;
    for (const word of sentence.split(" ")) {
      rating += wordRatings.get(word) || 0;
    }
    phraseRatings.set(index, rating);
  }

  const valuedSentences = Array.from(phraseRatings.entries());
  const orderedValuesSentences = valuedSentences.sort((firstValuedSentence, secondValuesSentence) => {
    return secondValuesSentence[1] - firstValuedSentence[1];
  }).slice(0, limit)
    .sort((firstValuedSentence, secondValuedSentence) => {
      return firstValuedSentence[0] - secondValuedSentence[0];
    });

  const result = [];

  for (const valuedSentence of orderedValuesSentences) {
    result.push(sentences[valuedSentence[0]]);
  }

  return result.join(" ");
}

const splitSentences = (text: string) => {
  // eslint-disable-next-line no-useless-escape
  return (text.match(/[^\.!\?\n]+/g) || [])
    .map(sentence => sentence.trim())
    .filter(sentence => {
      return (sentence.length > 15 && sentence.length < 250)
        && !sentenceContains(sentence, "you agree to")
        && !sentenceContains(sentence, "privacy policy")
        && !sentenceContains(sentence, "terms & conditions")
        && !sentenceContains(sentence, "terms and conditions")
        && !sentenceContains(sentence, "registered trademark")
        && !sentenceContains(sentence, "cookies")
        && !sentenceContains(sentence, "user agreement")
        && !sentenceContains(sentence, "login")
        && !sentenceContains(sentence, "register")
        && !sentenceContains(sentence, "http://")
        && !sentenceContains(sentence, "https://")
        && !sentenceContains(sentence, "press j to jump to the feed")
        && !sentenceContains(sentence, "javascript is not available")
        && !sentenceContains(sentence, "please enable javascript")
    });
}

const sentenceContains = (sentence: string, search: string) => {
  return sentence.toLowerCase().indexOf(search) >= 0;
}