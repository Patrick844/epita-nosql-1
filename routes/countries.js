const express = require('express');
const ContinentModel = require('../models/Continent');
const router = express.Router()

const CountryModel = require('../models/Country')

router.get('/', async (request, response) => {
    const countries = await CountryModel.find().populate('continent');
    response.status(200).json(countries);
});



router.get('/orderby/',async (request,response) => {


    console.log("test")
    const countries = await CountryModel.find().sort({"population" : 1})
    response.status(200).json(countries);
})

router.get('/:id', async (request, response) => {
    const countryId = request.params.id;

    const countries = await CountryModel.findOne({
        _id: countryId
    });
    
    response.status(200).json(countries);
});

router.post('/', async (request, response) => {
    const {name, isoCode,cont} = request.body


    const continentGet = await ContinentModel.findOne({
        "name" : cont
    });
 

    const cont_id = continentGet.id;

    console.log(cont_id)
    const country = await CountryModel.create({
        name: name,
        isoCode,
        continent : cont_id
        

    });
    console.log(country)
    continentGet.countries.push(country.id);
    continentGet.save("done")

    response.status(200).json(country);
});

router.delete('/:id', async (request, response) => {
    const countryId = request.params.id;

    await CountryModel.findOneAndDelete({
        _id: countryId
    });

    response.status(200).json({msg: 'Country well deleted !'});
});

router.put('/:id', async (request, response) => {
    const countryId = request.params.id;
    const {name, isoCode} = request.body

    const country = await CountryModel.findOneAndUpdate({
        _id: countryId
    },{
        name,
        isoCode
    },{
        new: true
    });

    response.status(200).json(country);
});



router.put('/update/population/:key/', async (request, response) => {
    const key = request.params.key;
    const {population} = request.body

    const country = await CountryModel.findOneAndUpdate({
        name : key
    },{
        population : population
    },{
        new: true
    });

    response.status(200).json(country);
});



router.get('/filter/:key', async (request, response) => {


    const key=request.params.key
    
    const reg= new RegExp("^.*["+key+"||"+key.toUpperCase()+"]"+".*$");


    const countries = await CountryModel.find({
         $and:[{
            name:{$regex : reg}

         },{

           population : {$gt : 70000000}
        }
       ]

    });
    response.status(200).json(countries);
});



module.exports = router;