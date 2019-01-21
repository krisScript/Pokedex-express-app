const getData = require('../util/getData');
exports.getPokedex = (req, res, next) => {
  let apiUrl;
  const { nextPage } = req.body;
  const { previousPage } = req.body;
  if (nextPage) {
    apiUrl = nextPage;
  } else if (previousPage) {
    apiUrl = previousPage;
  } else {
    apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
  }
  getData(apiUrl)
    .then(data => {
      const pokedex = data.results.map(pokemon => {
        const splitUrlArr = pokemon.url.split('/');
        const pokemonIdNum = splitUrlArr.length - 2;
        const pokemonId = splitUrlArr[pokemonIdNum];
        console.log(pokemonId)
        const spriteFront = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
        pokemon['spriteFront'] = spriteFront;
        pokemon['id'] = pokemonId;
        return pokemon;
      });
      res.render('pokemon/pokedex', {
        pokedex,
        path: '/',
        title: 'Pokedex',
        previous: data.previous,
        next: data.next
      });
    })
    .catch(error => {
      throw error;
    });
};
exports.getPokemon = (req, res, next) => {
  let { pokemonName } = req.params;
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  console.log(apiUrl);
  getData(apiUrl)
    .then(data => {
      if (data.status === 404) {
        res.render('search-error', {
          error: `Pokemon with name ${pokemonName} wasn't found.Make sure that your search parameters are correct`,
          path: '/search-error',
          title: 'Search Error'
        });
      }
      const stats = data.stats.map(info => {
        return {
          statValue: info.base_stat,
          statName: info.stat.name
        };
      });
      data.stats = stats;
      res.render('pokemon/pokemon', {
        path: '/pokemon',
        title: data.name,
        pokemon: data
      });
    })
    .catch(error => {
      throw error;
    });
};
