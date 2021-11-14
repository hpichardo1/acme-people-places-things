//require variables from db.js
const { syncAndSeed, conn, models: {People, Place, Thing, Souvenir}} = require("./db");


const express = require("express");
const app = express();

// use MIDDDLEWARE to smooth out the process
//1. why do models have acces to the actual table
app.use(require("method-override")("_method"));


app.use(express.urlencoded({ extended: true }));

//create routes
app.delete('/souvenir/:id', async(req, res, next) => {
  try {
      console.log(req.params.id)
      const souvenirInstance = await Souvenir.findByPK(req.params.id) 
      souvenirInstance.destroy()
      res.redirect('/')
  } catch(err){
      next(err)
  }
})

app.post("/souvenir", async (req, res, next) => {
  try {
    const newPurchase = new Souvenir(req.body);
    await newPurchase.save();
    res.redirect('/')
  } catch (err) {
    next(err);
  }
});

app.get("/", async (req, res, next) => {
  try {
    const peoples = await People.findAll();
    const places = await Place.findAll();
    const things = await Thing.findAll();
    // Souvenir table is empty in db.js, explain this step
    const souvenirs = await Souvenir.findAll({
      include: [ People, Place, Thing],
    });
    res.send(`
        <html>
        <head>
          <title> Acme People Places Things</title>
        </head>
        <body>
          <div class = 'memories'>
            <ul>

            <h1> Person</h1>
          <form method="POST" action="/souvenir" type="submit" value="Purchase">
                <select name="personId">
                  
                    ${peoples
                      .map(
                        (person) =>
                          ` <option value ="${person.id}">${person.firstName}</option>`
                      )
                      .join()}
                </select>

                <h1> Place</h1>
                  <select name="placeId">
                   
                    ${places
                      .map(
                        (place) =>
                          ` <option value="${place.id}">${place.place}</option>`
                      )
                      .join()}
                  </select>

                <h1> Thing</h1>
                <select name="thingId">
                  
                  ${things
                    .map(
                      (thing) =>
                        ` <option value="${thing.id}">${thing.name}</option>`
                    )
                    .join()}
                </select>

               <button type="submit" value="Purchase">Purchase</button> 
            </form>
            ${souvenirs.map((souvenir) => {
                //console.log('souvenir--->', souvenir)
                console.log(typeof JSON.stringify(souvenir.createdAt))
              return `                
                  <li> 
                    ${souvenir.person.firstName} purchase 1 ${souvenir.thing.name} in ${JSON.stringify(souvenir.createdAt).slice(1,11)}.
                  </li>

                  <form method="POST" action="/souvenir/?_method=DELETE" type="submit" >
                  <button>X</button>
                </form>`;
              }).join('')}
            </ul>
          </div>

        </body>
        </html>
        `);
  } catch (ex) {
    next(ex);
  }
});


//function that is meant to invooke necessary functions
const init = async () => {
  try {
    await conn.sync({ force: true });

    await syncAndSeed();
    const port = 3000;
    await app.listen(port, () => {
      console.log(`listenning on port ${port}`);
    });
  } catch (error) {
    console.log(error, "ERROR");
  }
};

//function invoked
init();
