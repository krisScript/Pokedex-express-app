const getData = require('../util/getData');
const getStringValue = require('../util/getStringValue');
const displaySearchErrorPage = require('../util/displaySearchErrorPage');
exports.getMoves = (req, res, next) => {
  let apiUrl;
  const { nextPage } = req.body;
  const { previousPage } = req.body;
  if (nextPage) {
    apiUrl = nextPage;
  } else if (previousPage) {
    apiUrl = previousPage;
  } else {
    apiUrl = 'https://pokeapi.co/api/v2/move';
  }
  getData(apiUrl)
    .then(data => {
      res.render('moves/moves', {
        moves: data.results,
        path: '/moves',
        title: 'Moves',
        previous: data.previous,
        next: data.next
      });
    })
    .catch(error => {
      throw error;
    });
};
exports.getMove = (req, res, next) => {
  let { moveName } = req.params;
  const apiUrl = `https://pokeapi.co/api/v2/move/${moveName}`;
  getData(apiUrl)
    .then(data => {
      displaySearchErrorPage(data.status, 'Move', moveName, res);
      const stats = getStringValue(data);
      const move = {
        stats,
        name: data.name,
        effect_entries: data.effect_entries
      };
      res.render('moves/move', {
        path: '/move',
        title: data.name,
        move
      });
    })
    .catch(error => {
      throw error;
    });
};
