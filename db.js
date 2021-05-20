const Sequelize = require("sequelize");
const { STRING } = Sequelize;
​
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/people_and_places_db');
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
const Place = conn.define('places', {
    name: {
        type: STRING
    }
});
​
const Thing = conn.define('things', {
    name: {
        type: STRING
    }
});
​
​
const Souvenir = conn.define('souvenirs', {
});
​
Souvenir.belongsTo(People);
Souvenir.belongsTo(Place);
Souvenir.belongsTo(Thing);
Thing.belongsTo(Place);
People.hasMany(Thing);
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