import axios, {AxiosInstance} from 'axios';
import * as cheerio from 'cheerio';

interface Anime {
  name: string
  id: string
}

interface AnimeEp {
  anime: Anime
  title: string
  ep: number
}

interface AnimeVideo {
  ep: AnimeEp
  url: string
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

      if (!name || !url) throw new Error('Anime not found');

      animes.push({
        name,
        id: url.split('/')[2],
      });
    });


    return animes;
  }

  async getEps(anime: Anime): Promise<AnimeEp[]> {
    const $ = await this.getHtml(`/category/${anime.id}`);

    const title = $('#episode_page li a').text().replace('0-', '1-');

    const totalEps = parseInt(title.split('-')[1]);
    const eps: AnimeEp[] = [];
    for (let i = 0; i < totalEps; i++) {
      eps.push({
        anime,
        title: `EP ${i+1}`,
        ep: i+1,
      });
    }

    return eps;
  }
}

export default Scraping;
