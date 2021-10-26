import Scraping from './controllers/scraping';
import Cli from './controllers/cli';

const scraping = new Scraping();
const cli = new Cli();

const run = async (): Promise<void> => {
  const animeOptions = await scraping.search(await cli.getSearchQuery());
  const choosenAnime = await cli.chooseAnime(animeOptions);
  const ep = await cli.chooseEp(await scraping.getEps(choosenAnime));

  const videoUrls = await scraping.getEmbeddedVideo(ep);
  console.log(videoUrls);
};

run();
