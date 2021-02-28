const express = require('express');
const app = express();
const router = express.Router();
const port = 3000;

db={
  "bob":190,
  "bob_time":["202012260903","202012300907","202012301712","202102231740","202102232023"],
  "bob_count":{"20201226":1,"20201230":2,"20210223":2},
  "alice":0,
  "alice_time":[],
  "alice_count":{}
  }

let capitalizeUser = u => u.charAt(0).toUpperCase() + u.slice(1)

// format expected is YYYYMMDDhhmm
let convertToDate = (dt) => new Date( parseInt(dt.substring(0,4)),parseInt(dt.substring(4,6))-1, parseInt(dt.substring(6,8)),parseInt(dt.substring(8,10)),parseInt(dt.substring(10,12)) ) 
let isTwoDatesMoreThanTwoHoursApart = (dt1,dt2) =>  Math.abs(convertToDate(dt1)-convertToDate(dt2)) > 7200000  // 2*60*60*1000
let getDay = (dt) => { return dt.substring(0,8)}
function isTwoDatesSameDay(dt1,dt2){ return (typeof dt2 == 'undefined')?false:(getDay(dt1)==getDay(dt2))}



app.get('/', (request, response) => response.send('Exercice is good for you'));

// all routes prefixed with /v1
app.use('/v1', router);

router.get('/:name', (req, response) => {
  var user = req.params.name;
  if (db.hasOwnProperty(user)){ response.json({"msg": capitalizeUser(user)+' has '+db[user]+' cents',"last-time":db[user+"_time"][db[user+"_time"].length - 1]})}
  else { response.json({"msg": "no user under that name","last-time":""}) }
});

router.post('/:name/:dateAndtime', (req, response) => {
  var user = req.params.name;
  var dat =  req.params.dateAndtime
  var day = getDay(dat)
  var previous_dat = db[user+"_time"][db[user+"_time"].length - 1]
  if (db.hasOwnProperty(user)){
    if (isTwoDatesSameDay(dat,previous_dat) ){
      if (isTwoDatesMoreThanTwoHoursApart(dat,previous_dat)){
        db[user+"_time"].push(dat)
        if ( db[user+"_count"][day] <2) { db[user]+=30}
        db[user+"_count"][day]++
      } else {
        if (dat!=previous_dat){
          db[user+"_count"][day]=1
          db[user+"_time"].push(dat)
        }
      }
    } else {
      db[user+"_count"][day]=1
      db[user+"_time"].push(dat)
      db[user]+=50
    }
  }
  response.end()
});


// set the server to listen on port 3000
app.listen(port, () => console.log(`Listening on port ${port}`));
