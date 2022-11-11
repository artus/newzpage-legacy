import axios from "axios";

export class HttpService {
  public async getHtml(url: string) {
    return (await axios.get(url)).data;
  }
}