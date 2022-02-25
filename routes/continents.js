const express = require('express');
const router = express.Router()

const ContinentModel = require('../models/Continent')

router.get('/', async (request, response) => {
    const continents = await ContinentModel.find().populate('countries');
    response.status(200).json(continents);
});

router.get('/count',async (request,response) =>{

    const continents = await ContinentModel.find()
    const ctrycount=[]
    console.log(continents[0].countries.length)
    continents.forEach(c => {

        
       ctrycount.push({

            
        
            key : c.name,
            values : c.countries.length
        }) 
       
    });
    response.status(200).json(ctrycount);


})


router.get('/count/:key',async (request,response) =>{

    const key = request.params.key;

    const continents = await ContinentModel.findOne({

        name : key

    }).populate({path:'countries', options:{ sort: {"name":1}}});

    console.log(continents.countries.length)

    
    


  

  
    response.status(200).json(continents.countries[3]);
})

module.exports = router;