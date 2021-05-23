const Sequelize = require("sequelize");

const {DataTypes:{STRING, INTEGER}  } = Sequelize;
const conn = new Sequelize('postgres://localhost/acmepeople');

const data = {
    people: ['moe', 'larry', 'lucy', 'ethyl'],
    places: ['paris', 'nyc', 'chicago', 'london'],
    things: ['foo', 'bar', 'bazz', 'quq']
  };

const People = conn.define('people', {
    name: {
        type: STRING,
    }
});

const Place = conn.define('place', {
    name: {
        type: STRING,
    }
});

const Thing = conn.define('thing', {
    name: {
        type: STRING,
    }
});

const Souvenir = conn.define('souvenir', {

});

Souvenir.belongsTo(People);
Souvenir.belongsTo(Place);
Souvenir.belongsTo(Thing);

People.hasMany(Souvenir);
Place.hasMany(Souvenir);
Thing.hasMany(Souvenir);

const syncAndSeed = async() => {
    await conn.sync( {force: true} );
// WHY store these promises in variables like peoples, 
//but then NOT use them and  export the models 
    await data.people.forEach(d => People.create({name: d}))
    await data.places.forEach(d => Place.create({name: d}))
    await data.things.forEach(d => Thing.create({name: d}))
    await Souvenir.create({ personId: 1, placeId: 1, thingId: 1 })

    // const peoples =  Promise.all(
    //     data.people.map(name => People.create({name}))
    // )
    // const places =  Promise.all(
    //     data.places.map(name => Place.create({name}))
    // )
    // const things =  Promise.all(
    //     data.things.map(name => Thing.create({name}))
    // )
    // const souvernirs = Promise.all(

    // )
};

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