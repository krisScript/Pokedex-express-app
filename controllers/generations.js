const getData = require('../util/getData');
const getPokemonIdFromUrl = require('../util/getPokemonIdFromUrl');
const displaySearchErrorPage = require('../util/displaySearchErrorPage');
exports.getGenerations = (req, res, next) => {
  let apiUrl;
  const { nextPage } = req.body;
  const { previousPage } = req.body;
  if (nextPage) {
    apiUrl = nextPage;
  } else if (previousPage) {
    apiUrl = previousPage;
  } else {
    apiUrl = 'https://pokeapi.co/api/v2/generation/';
  }
  getData(apiUrl)
    .then(data => {
      res.render('generations/generations', {
        generations: data.results,
        path: '/generations',
        title: 'Generations',
        previous: data.previous,
        next: data.next
      });
    })
    .catch(error => {
      throw error;
    });
};
exports.getGeneration = (req, res, next) => {
  let { generationName } = req.params;
  const apiUrl = `https://pokeapi.co/api/v2/generation/${generationName}`;
  getData(apiUrl)
    .then(data => {
      displaySearchErrorPage(data.status, 'Generation', generationName, res);
      const pokemon_species = data.pokemon_species.map(pokemon => {
        const pokemonId = getPokemonIdFromUrl(pokemon.url);
        const spriteFront = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
        pokemon['id'] = pokemonId;
        pokemon['spriteFront'] = spriteFront;

        return pokemon;
      })
      res.render('generations/generation', {
        path: '/generation',
        title: data.name,
        generation:data,
      });
    })
    .catch(error => {
      throw error;
    });
};
