import axios, {AxiosInstance} from 'axios';
import * as cheerio from 'cheerio';

interface AnimeSearch {
  name: string
  url: string
}

class Scraping {
  api: AxiosInstance;
  constructor() {
    this.api = axios.create({baseURL: 'https://gogoanime.vc'});
  }

  private async getHtml(path: string): Promise<string> {
    const content = await this.api.get(path)
        .then(({data}) => {
          if (!data) throw new Error('No data found');

          return data as string;
        },
        );

    return content;
  }

  async search(query: string): Promise<AnimeSearch[]> {
    const $ = cheerio.load(
        await this.getHtml(`/search.html?keyword=${query}`),
    );

    const animes: AnimeSearch[] = [];
    $('p[class=name] a').each((index, element) => {
      const name = $(element).attr('title');
      const url = $(element).attr('href');

      if (!name || !url) return;

      animes.push({
        name,
        url,
      });
    });


    return animes;
  }
}

export default Scraping;
