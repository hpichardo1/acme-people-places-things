const { conn, syncAndSeed, models: { People, Place, Thing} } = require('./db');
const Sequelize = require("sequelize");
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
​
app.use('/public', express.static(path.join(__dirname, 'public')));
​
app.get('/', async(req, res, next)=> {
    try {
        const [peoples, places, things] = await Promise.all([
            People.findAll(),
            Place.findAll(),
            Thing.findAll(),
        ])
        res.send({
            peoples,
            places,
            things
        })
    }
    catch(error) {
        next(error)
    }
})
​
const init = async () => {
    await conn.sync({force: true});
    await syncAndSeed();
    console.log('connected to db');
    await app.listen(port, () => {
        console.log(`listenning on port ${port}`)
    });
​
}
​
init();