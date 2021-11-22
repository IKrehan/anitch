import Scraping from './controllers/scraping';
import Cli from './controllers/cli';
import open from 'open';


const scraping = new Scraping();
const cli = new Cli();

(async () => {
  const animeOptions = await scraping.search(await cli.getSearchQuery());
  const choosenAnime = await cli.chooseAnime(animeOptions);
  const ep = await cli.chooseEp(await scraping.getEps(choosenAnime));
  const videoUrls = await scraping.getEmbeddedVideo(ep);

  /* by now its opening the bare url, in the future the objective is to open
  the video in some kind of custom player, web or local. */
  open(videoUrls[0].url);
})();
