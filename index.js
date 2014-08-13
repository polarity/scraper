// import all needed libraies
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var json2csv = require('json2csv');
var utf8 = require('utf8');

// start a new express app
var app     = express();

// define a route for the express app
// http://yourdomain.de/scrape
app.get('/scrape', function(req, res){

    // check if theres a ?url=bla parameter
    // in the url string
    if(req.query.url){
        // use it
        url = req.query.url;
    } else {
        // no query there,
        // use default value
        url = 'https://ssl.globus-online.com/index.php?link=detail&artikel=GL51553-MAN';
    }

    // use the request library and load a html site
	request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request
        if(!error){

            // Next, we'll utilize the cheerio library on the 
            // returned html which will essentially give us 
            // jQuery functionality
            var $ = cheerio.load(html);

            // create a json object and collect 
            // data via jQuery from the loaded website
            var json = {
                'Artikelnummer': $('strong:contains(Artikelnummer)').parent().parent().find('td.right').text(),
                'Name': $('strong:contains(Name)').parent().parent().find('td.right').text(),
                'Beschreibung': $('strong:contains(Beschreibung)').parent().parent().find('td.right').text(),
                'Maße': $('strong:contains(Maße)').parent().parent().find('td.right').text(),
                'Nachfüllbar': $('strong:contains(Nachfüllbar)').parent().parent().find('td.right').text(),
                'EAN-Code': $('strong:contains(EAN-Code)').parent().parent().find('td.right').text(),
                'Verpackung': $('strong:contains(Verpackung)').parent().parent().find('td.right').text(),
                'Gewicht': $('strong:contains(Gewicht)').parent().parent().find('td.right').text()
            };

            // create a CSV Dataset with the json
            // object
            json2csv({data: json, fields: [
                'Artikelnummer',
                'Name',
                'Beschreibung',
                'Maße',
                'Nachfüllbar',
                'EAN-Code']}, function(err, csv){

                // when the csv convert is ready
                // send html to the client
                res.charset = 'utf-8';
                res.send('<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><form action="?" method="get"><input name="url" type="text" value="'+url+'" style="width: 500px;"><input type="submit"></form><textarea cols="200" rows="10">'+csv+'</textarea>'.toString('utf8'));

            });
		}
	});
});

// Start the app and listen
// for request on this port
app.listen('64166');

// export the app to use this
// file as a module
exports = module.exports = app;