import { Optional } from "../control-structures";
import { Summary } from "../summary";
import { SummaryRepository } from "../summary-repository";

export class InMemorySummaryRepository implements SummaryRepository {

  private readonly summaries = new Map<string, Summary>();

  public async saveSummary(summary: Summary): Promise<Summary> {
    this.summaries.set(summary.url, summary);
    return summary;
  }

  public async getSummary(url: string): Promise<Optional<Summary>> {
    const result = this.summaries.get(url);

    if (result) {
      return Optional.of(result);
    } else {
      return Optional.empty();
    }
  }
}