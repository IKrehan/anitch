import axios, {AxiosInstance} from 'axios';
import * as cheerio from 'cheerio';

interface Anime {
  name: string
  url: string
}

interface AnimeEp {
  name: string
  url: string
  stream?: string
}

class Scraping {
  api: AxiosInstance;
  constructor() {
    this.api = axios.create({baseURL: 'https://gogoanime.vc'});
  }

  private async getHtml(path: string): Promise<cheerio.CheerioAPI> {
    const content = await this.api.get(path)
        .then(({data}) => {
          if (!data) throw new Error('No data found');

          return data as string;
        });

    return cheerio.load(content);
  }

  async search(query: string): Promise<Anime[]> {
    const $ = await this.getHtml(`/search.html?keyword=${query}`);

    const animes: Anime[] = [];
    $('p[class=name] a').each((_, element) => {
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

  async getEps(path: string): Promise<{title: string, eps: AnimeEp[]}> {
    const $ = await this.getHtml(path);

    const title = $('#episode_page li a').text().replace('0-', '1-');

    const totalEps = parseInt(title.split('-')[1]);
    const eps: AnimeEp[] = [];
    for (let i = 0; i < totalEps; i++) {
      eps.push({
        name: `EP ${i+1}`,
        url: `/${path.split('/')[2]}-episode-${i+1}`,
      });
    }

    return {title, eps};
  }
}

export default Scraping;
