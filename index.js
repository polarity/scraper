var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var json2csv = require('json2csv');
var utf8 = require('utf8');
var app     = express();

app.get('/scrape', function(req, res){
    console.log('Request:',req.query);
    if(req.query.url){
        url = req.query.url;
    } else {
        url = 'https://ssl.globus-online.com/index.php?link=detail&artikel=GL51553-MAN';
    }

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

	request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

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
            json2csv({data: json, fields: [
                'Artikelnummer',
                'Name',
                'Beschreibung',
                'Maße',
                'Nachfüllbar',
                'EAN-Code']}, function(err, csv){
                res.charset = 'utf-8';
                res.send('<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><form action="?" method="get"><input name="url" type="text" value="'+url+'"><input type="submit"></form><textarea cols="200" rows="10">'+csv+'</textarea>'.toString('utf8'));
            });
		}
	});
});

app.listen('64166');
console.log('port 64166');
exports = module.exports = app;