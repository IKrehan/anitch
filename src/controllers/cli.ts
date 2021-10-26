import inquirer from 'inquirer';
import {Anime, AnimeEp} from './scraping';

class Cli {
  constructor() {
    console.log(`
    █████╗  ███╗   ██╗██╗████████╗ ██████╗██╗  ██╗
    ██╔══██╗████╗  ██║██║╚══██╔══╝██╔════╝██║  ██║
    ███████║██╔██╗ ██║██║   ██║   ██║     ███████║
    ██╔══██║██║╚██╗██║██║   ██║   ██║     ██╔══██║
    ██║  ██║██║ ╚████║██║   ██║   ╚██████╗██║  ██║
    ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝

    `);
  }

  async getSearchQuery(): Promise<string> {
    return inquirer.prompt({
      type: 'input',
      name: 'search',
      message: 'Wich Anime you want to watch?',
      validate(value: string) {
        if (value) return true;

        return 'Please search for something';
      },
    })
        .then((answer) => {
          return answer.search;
        }).catch((err) => {
          return err;
        });
  }

  async chooseAnime(animeOptions: Anime[]) {
    return inquirer.prompt({
      type: 'list',
      name: 'anime',
      message: 'Wich one of them?',
      choices: animeOptions.map((anime) =>({
        name: anime.name,
        value: anime,
      })),
    })
        .then((answer) => {
          return answer.anime;
        }).catch((err) => {
          return err;
        });
  }

  async chooseEp(animeEps: AnimeEp[]) {
    return inquirer.prompt({
      type: 'list',
      name: 'anime',
      message: 'Wich episode?',
      choices: animeEps.map((ep) =>({
        name: ep.title,
        value: ep,
      })),
    })
        .then((answer) => {
          return answer.anime;
        }).catch((err) => {
          return err;
        });
  }
}

export default Cli;
