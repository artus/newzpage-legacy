import { chainable } from "valivalue";
import { CONSTANTS } from "./constants";

export class Summary {
  constructor(
    readonly url: string,
    readonly sentences: string[],
    readonly scores: Map<number, number>
  ) {
    chainable(true)
      .objects.validateNotNullOrUndefined(url, "Summary url")
      .objects.validateNotNullOrUndefined(sentences, "Summary sentences")
      .objects.validateNotNullOrUndefined(scores, "Summary scores")
      .numbers.validateMaxValue(sentences.length, CONSTANTS.DEFAULT_SENTENCE_LIMIT, "Total summary sentences")

    if (scores.size !== sentences.length) {
      throw new Error(`Summary sentences length does not match size of scores.`);
    }
  }

  getHighestScoringSentences(limit = CONSTANTS.DEFAULT_SENTENCE_LIMIT): string[] {

    const total = this.sentences.length;

    chainable(true)
      .numbers.validateIsPositive(limit, "Summary limit")
      .numbers.validateMaxValue(limit, 50, "Summary limit")
      .numbers.validateMinAndMaxValue(limit, 0, total, "Summary limit", (_subject, value, _min, max) => {
        return `Provided limit (${value}) is higher than total sum of sentences (${max}).`;
      });

    if (limit === total) {
      return this.sentences;
    }

    const allScoresOrderedDescending = [...this.scores.entries()].sort((firstScore, secondScore) => {
      return secondScore[1] - firstScore[1];
    });

    const highestScoringIndexes: number[] = [];

    while (highestScoringIndexes.length < limit) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      highestScoringIndexes.push(allScoresOrderedDescending.shift()![0]);
    }

    const highestScoringIndexesInOrder = highestScoringIndexes.sort((firstIndex, secondIndex) => {
      return firstIndex - secondIndex;
    });

    return highestScoringIndexesInOrder.map(index => this.sentences[index]);
  }

  public getSummary(limit = CONSTANTS.DEFAULT_SENTENCE_LIMIT) {
    return this.getHighestScoringSentences(limit).join(" ");
  }
}