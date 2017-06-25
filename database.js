'use strict';
const mongoose = require('mongoose');
const scraper = require(__dirname + '/scraper');

mongoose.connect('mongodb://localhost/companyData');

let Company;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("successfully connected to mongoDB :)");
  let companySchema = mongoose.Schema({
    name: String,
    data: [],
    history: {}
  });
  Company = mongoose.model('Company', companySchema);
});


function search(res, companyName) {
  let companyNameShort = companyName.slice(0, 5);
  Company.findOne({name: {$regex : "^" + companyNameShort}}, (err, doc) => {
      if(doc) {
        res.json(doc);
      }
      else {
        console.log("Error! No entry, begin with " + companyNameShort + " found.");
        scraper.scrapeFor(res, companyName);
      };
  });
};

function getAll(res, detailed) {
  // respond with all companyNames in DB
  let output = [];
  let outputDetailed = [];
  Company.find({}, (err, companies) => {
    for(let i = 0; i < companies.length; i++) {
        output.push(new Object({name: companies[i].name}));
        outputDetailed.push(companies[i]);
    };
    detailed ? res.json(outputDetailed) : res.json(output);
  });

};
// saves new data as JSON in DB and puts out JSON to client
function save(res, companyName, companyData, companyHistory) {
    companyData = JSON.parse(companyData);
   companyHistory = JSON.parse(companyHistory);

   let data = [];
   // populates data array with: Jahr und Gewinn
   companyData.item[0].data.data.forEach(element => {
     data.push({year: element.year, gewinn: element.value0});
   });
   //populates adds the value bilanzsumme for every year
   companyData.item[1].data.data.forEach((element, index) => {
     data.forEach(dataElement => {
       if(dataElement.year === element.year) {
         dataElement.bilanzsumme = element.value0;
       };
     });
   });
   // populates the history object with data
   let history = {};
   history.minDate = companyHistory.minDate;
   history.maxDate = companyHistory.maxDate;
   history.events = [];
   companyHistory.event.forEach(element => {
     let event = {};
     event.text = element.text;
     event.time = element.time;
     history.events.push(event);
   });
   // complete the company object with data
   let company = new Company({ name: companyName, data: data, history: history});
   // save company object to database
   company.save((err, company) => {
     if(err) res.json(err);
     console.log(company.name + " wurde gespeichert!!");
     res.json(company);

   });


};

module.exports.search = search;
module.exports.save = save;
module.exports.getAll = getAll;
