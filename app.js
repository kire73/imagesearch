// Image Search Abstraction Layer
require('dotenv').config();
var express = require('express');
var app = express();
var path = require('path');
var imageSearch = require('node-google-image-search');
 


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

var url;
var snippet;
var thumbnail;
var context;
var newResults;
var readable;
var pastSearches = [];



app.get('/api/imagesearch/:encodedid', function(req, res){
    var search = req.params.encodedid;
    console.log('User search: ' + search);
    var when = new Date();
    var page = 0;
    
    if (req.query.offset){
        page = req.query.offset;
        console.log('Searches per page: ' + page);
    } else {
        console.log('Default to 5 entries::');
        page = 5;
    }
    
    
    var results = imageSearch(search, callback, 0, page);
    
    function callback(results) {
        newResults = [];
        for (var i = 0; i < results.length; i++){
            url = results[i].link;
            snippet = results[i].snippet;
            thumbnail = results[i].image.thumbnailLink;
            context = results[i].image.contextLink;
            newResults.length++;
            newResults[i] = {url, snippet, thumbnail, context};
        }
        readable = JSON.stringify(newResults);
        console.log('Success: ' + readable);
        res.send(readable);
    }
    console.log('Last search: ' + pastSearches);
    pastSearches += JSON.stringify({search,when});
});

app.get('/api/latest/imagesearch/', function(req, res){
    console.log('User requested history: ' + pastSearches);
  res.send(pastSearches);  
});

 app.listen(process.env.PORT, function () {
  console.log('App open on port ' + process.env.PORT + ':');
  
});