var express = require('express');
const { serialize, parse } = require('../utils/json');
var router = express.Router();

const jsonDbPath = __dirname + '/../data/pizzas.json';

const MENU = [
    {id : 1,
     title : "Quatre fromages",
     content : "Parmesan, gorgonzola, mozzarella, provolone"
    },
    {id : 2,
     title : "Quatre saisons",
     content : "Artichauts, jambon, mozzarella, tomates"
    },
    {id : 3,
     title : "Vegan",
     content : "Fromage vegan, légumes, sauce tomate"
    }   
];

//READ all the pizzas from the menu
router.get('/', function(req, res, next) {
    const pizzas = parse(jsonDbPath, MENU);
    res.json(pizzas);
  });

//READ one pizza of given id
router.get('/:id', function(req, res, next) {
  const pizzas = parse(jsonDbPath, MENU);

  const indexOfPizzaFound = pizzas.findIndex((pizza) => pizza.id == req.params.id);

  if(indexOfPizzaFound < 0){
    return res.sendStatus(404);
  }

  res.json(pizzas[indexOfPizzaFound]);
});

//CREATE a new pizza and add it to the menu
router.post('/', function(req, res, next) {
  const title = req?.body?.title?.length !== 0 ? req.body.title : undefined; 
  const content = req?.body?.content?.length !== 0 ? req.body.content : undefined;

  if(!title || !content){
    return res.sendStatus(400); //error for a bad expression (400 bad request)
  }

  const pizzas = parse(jsonDbPath, MENU);

  const lastItemIndex = pizzas?.length !== 0 ? pizzas.length - 1 : undefined;
  const lastId = lastItemIndex !== undefined ? pizzas[lastItemIndex]?.id : 0;
  const nextId = lastId + 1;

  const newPizza = {
    id : nextId,
    title : title,
    content : content
  };

  pizzas.push(newPizza);
  serialize(jsonDbPath, pizzas);
  res.json(newPizza);
});

//DELETE a pizza from the menu
router.delete('/:id', function(req, res, next) {
  const pizzas = parse(jsonDbPath, MENU);

  const foundIndex = pizzas.findIndex(pizza => pizza.id == req.params.id);

  if(foundIndex < 0){
    return res.sendStatus(404);
  }

  const itemsRemovedFromMenu = pizzas.splice(foundIndex, 1);
  const itemRemoved = itemsRemovedFromMenu[0];

  serialize(jsonDbPath, pizzas);
  res.json(itemRemoved);
});

//UPDATE a pizza based on its id and new values for its parameters
router.patch('/:id', function(req, res, next) {
  const title = req?.body?.title; 
  const content = req?.body?.content;

  if((!title && !content) || title?.length === 0 || content?.length === 0){
    return res.sendStatus(400);
  }

  const foundIndex = MENU.findIndex(pizza => pizza.id === req.params.id);
  if(foundIndex < 0){
    return res.sendStatus(404);
  }

  const updatedPizza = {...MENU[foundIndex], ...req.body};
  MENU[foundIndex] = updatedPizza;

  res.json(updatedPizza);
});

module.exports = router;
