const {conn, syncAndSeed, models: {People, Place, Thing}} = require('./db');

const port = 3000;




const init = async () => {
    try {
    await conn.sync({force: true});
    await syncAndSeed();

    await app.listen(port, () => {
        console.log(`listenning on port ${port}`)
    })
    }
    catch (error){
        console.log(error)
    }
}
init();