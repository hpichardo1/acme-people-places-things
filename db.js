// Require what is needed
const Sequelize = require("sequelize");
const {DataTypes:{STRING, INTEGER}  } = Sequelize;
const conn = new Sequelize('postgres://localhost/acmepeople', {logging: false});

//the initial data to feed into database
const data = {
    people: ['moe', 'larry', 'lucy', 'ethyl'],
    places: ['paris', 'nyc', 'chicago', 'london'],
    things: ['foo', 'bar', 'bazz', 'quq']
  };

//Create your models for the database
const People = conn.define('people', {
    name: {
        type: STRING,
        allowNull: false
    }
});

const Place = conn.define('place', {
    name: {
        type: STRING,
        allowNull: false
    }
});

const Thing = conn.define('thing', {
    name: {
        type: STRING,
        allowNull: false
    }
});

const Souvenir = conn.define('souvenir', {

});

// make associations between tables
Souvenir.belongsTo(People);
Souvenir.belongsTo(Place);
Souvenir.belongsTo(Thing);

People.hasMany(Souvenir);
Place.hasMany(Souvenir);
Thing.hasMany(Souvenir);

// MEANT to seed data into database
const syncAndSeed = async() => {
    await conn.sync( {force: true} );
// WHY store these promises in variables like peoples, 
//but then NOT use them and  export the models 
    await data.people.forEach(d => People.create({name: d}))
    await data.places.forEach(d => Place.create({name: d}))
    await data.things.forEach(d => Thing.create({name: d}))
    await Souvenir.create({ personId: 1, placeId: 1, thingId: 1 })

    // const peoples = data.people.map(name => People.create({name}))
    
    // const places =  data.places.map(name => Place.create({name}))
    
    // const things =  data.things.map(name => Thing.create({name}))
    
    // const results = await Promise.all([peoples, places, things])
};


//export files, in order for Server file to import
module.exports = {
    conn,
    syncAndSeed,
    models: {
        People,
        Place,
        Thing, 
        Souvenir
    }
};