var express = require('express');
var router = express.Router();

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
    res.json(MENU);
  });

module.exports = router;
