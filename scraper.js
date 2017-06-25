'use strict';
const cheerio = require('cheerio'); // lets me traverse the DOM of scraped html body
const request = require ('request'); // lets me send http requests
const database = require(__dirname + '/database');


function scrapeFor(res, companyName, round) {
  console.log("not found, scraping now for... " + companyName);

  request('https://www.northdata.de/' + companyName , (err, response, body) => {
      let $ = cheerio.load(body);

      //console.log(landingPage);
      if($('.search-results').text()) {
        let newSearchQuery = $('.summary').first().children().attr('href');

        if(!round) {
          console.log("ich bin hier!!");
          scrapeFor(res, newSearchQuery, true);
        };
      };
      // replace companyName with target sites standard convention
      companyName = $('.prompt').attr('value');
      // companyData = Jahr, Bilanzsumme, Gewinn
      let companyData = $('.tab-content').attr('data-data');
      // companyHistory = Important Events and Dates in the History of the Company
      let companyHistory = $('.bizq').first().attr('data-data');
      // if companyData exists start saving in Database

      if(companyData) {
          // save in DB and return company data as JSON response
          database.save(res, companyName, companyData, companyHistory);
      } else if (round){
        let searchResults = $('.summary').text();
        res.json({"error": "Specify Company Name. Search Results: " +  searchResults});
      };
  });
};


module.exports.scrapeFor = scrapeFor;
