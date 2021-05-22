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
    const peoples =  Promise.all(
        data.people.map(name => People.create({name}))
    )
    const places =  Promise.all(
        data.places.map(name => Place.create({name}))
    )
    const things =  Promise.all(
        data.things.map(name => Thing.create({name}))
    )
    const results = await Promise.all([peoples, places, things])
};

module.exports = {
    conn,
    syncAndSeed,
    models: {
        People,
        Place,
        Thing
    }
};