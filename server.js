const {conn, syncAndSeed, models: {People, Place, Thing}} = require('./db');
const express = require('express')
const app = express();

//why do models have acces to the actual table

app.get('/', async(req, res, next)=>{
    try{
        const peoples = await People.findAll()
        res.send(`
        <html>
        <head>
        </head>
        <body>
            <div> 
              <ul>
                ${peoples.map(person => `<li>${person.name}</li>`).join('')}
              </ul>
            </div>
        </body>
        </html>
        `)
    }
    catch(ex){
        next(ex)
    }
})




const init = async () => {
    try {
    await conn.sync({force: true});
    await syncAndSeed();
    const port = 3000;
    await app.listen(port, () => {
        console.log(`listenning on port ${port}`)
    })
    }
    catch (error){
        console.log(error, 'ERROR')
    }
}
init();