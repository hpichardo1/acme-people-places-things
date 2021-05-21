const Sequelize = require('sequelize');
const { STRING } = Sequelize;
const conn = new Sequelize('postgres://localhost/acmepeople');
​
const data = {
    people: ['moe', 'larry', 'lucy', 'ethyl'],
    places: ['paris', 'nyc', 'chicago', 'london'],
    things: ['foo', 'bar', 'bazz', 'quq']
  };
  
​
const People = conn.define('people', {
    name: {
        type: STRING
    }
});
​
const Place = conn.define('place', {
    name: {
        type: STRING
    }
});
​
const Thing = conn.define('thing', {
    name: {
        type: STRING
    }
});
​
​
const Souvenir = conn.define('souvenir', {

});
​
Souvenir.belongsTo(People);
Souvenir.belongsTo(Place);
Souvenir.belongsTo(Thing);

People.hasMany(Souvenir);
Place.hasMany(Souvenir);
Thing.hasMany(Souvenir);
​


const syncAndSeed = async() => {
    await conn.sync( {force: true} );
    const peoples = await Promise.all(
        data.people.map(people => People.create({ people }))
    )
    const places = await Promise.all(
        data.places.map(place => People.create({ place }))
    )
    const things = await Promise.all(
        data.things.map(thing => People.create({ thing }))
    )

};
​
module.exports = {
    conn,
    syncAndSeed,
    models: {
        People,
        Place,
        Thing
    }
};