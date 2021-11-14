// Require what is needed
const Sequelize = require("sequelize");
const { DataTypes:{STRING, INTEGER}  } = Sequelize;

const conn = new Sequelize('postgres://localhost/acmepeople', {logging: false});

//the initial data to feed into database
const data = {
    people: ['moe', 'larry', 'lucy', 'ethyl'],
    places: ['paris', 'nyc', 'chicago', 'london'],
    things: ['foo', 'bar', 'bazz', 'quq']
  };

//Create your models for the database
const People = conn.define('people', {
    firstName: {
      type: STRING
    }
});


const Place = conn.define('place', {
    place: {
        type: STRING,
        allowNull: false,
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
 try {
    await conn.sync( {force: true} );
    await data.people.map( firstName => People.create( { firstName }))
    await data.places.map( place => Place.create({ place }))
    await data.things.map( thing => Thing.create({name: thing}))
    //await Souvenir.create({ personId: 1, placeId: 1, thingId: 1 })
 } catch (err){
    console.log(err)
 }
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