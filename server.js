const {conn, syncAndSeed, models: {People, Place, Thing, Souvenir}} = require('./db');
const express = require('express')
const app = express();

//why do models have acces to the actual table
app.use(require('method-override')('_method'))
app.use(express.urlencoded({extened: false}))

// app.put('i dont know yet', async(req, res, next)=>{
//     try {

//         res.redirect('/')
//     }
//     catch (err){
//            next(err)
//     }
// })

app.get('/', async(req, res, next)=>{
    try{
        const peoples = await People.findAll();
        const places = await Place.findAll();
        const things = await Thing.findAll()
        const souvenirs =await Souvenir.findAll({
            include: [
                {model: People, required: true},
                {model: Place, required: true},
                {model: Thing, required: true}
            ]
        })
        res.send(`
        <html>
        <head>
          <title> Acme People Places Things</title>
        </head>
        <body>

            <div class = 'person'> 
            <h1> Person</h1>
              <ul>
                <form>
                  <select>
                      <option> select </option>
                      ${peoples.map(person => ` <option value = '${person.id}'>${person.name}</option>`).join()}
                   </select>
                </form>



                
              </ul>
            </div>

            <div class = 'place'> 
            <h1> Place</h1>
              <ul>
              <form>
              <select>
              <option> select </option>
                  ${places.map(place => ` <option value= ${place.id}>${place.name}</option>`).join()}
               </select>
            </form>
              </ul>
            </div>

            <div class = 'thing'> 
            <h1> Thing</h1>
              <ul>
              <form>
              <select>
              <option> select </option>
                  ${things.map(thing => ` <option value= ${thing.id}>${thing.name}</option>`).join()}
               </select>
            </form>
              </ul>
            </div>

            <div id = 'dateAndCount'>

            <input type="number">
            
            <input type="date" id="start" name="trip-start"
       value="2018-07-22"
       min="2018-01-01" max="2018-12-31">

            </div>

            <div method="POST" action="/souvenir" class="createbutton">
            
            <button>Create</button>
            </div>

            <div>
              <ul>
               ${souvenirs.map(d => {
                   return  `
                   <li>${d.person.name} ${d.place.name} ${d.thing.name}</li>
                   `
               })}
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