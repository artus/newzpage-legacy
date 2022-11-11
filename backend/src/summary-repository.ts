import { Optional } from "./control-structures";
import { Summary } from "./summary";

export interface SummaryRepository {
  getSummary(url: string): Promise<Optional<Summary>>;
  saveSummary(summary:Summary): Promise<Summary>;
}