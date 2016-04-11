var express = require('express');
var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res){
	url = 'http://www.imdb.com/title/tt1229340/';
	request(url, function(error, response, html){ 

        // First we'll check to make sure no errors occurred when making the request

        if(!error){ 
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture

            var title, release, rating;
            var json = { title : "", release : "", rating : ""};
			
			
			// We'll use the unique header class as a starting point.

            $('.title_wrapper').filter(function(){

           // Let's store the data we filter into a variable so we can easily see what's going on.

                var data = $(this);

           // In examining the DOM we notice that the title rests within the first child element of the header tag. 
           // Utilizing jQuery we can easily navigate and get the text by writing the following code:

                title = data.children().first().text();

           // Once we have our title, we'll store it to the our json object.

                json.title = title;
				
				// We will repeat the same process as above.  This time we notice that the release is located within the last element.
                // Writing this code will move us to the exact location of the release year.

                release = data.children().last().children().last().text();
				json.release = release;
				
            });
			
			// Since the rating is in a different section of the DOM, we'll have to write a new jQuery filter to extract this information.

            $('.ratingValue').filter(function(){
                var data = $(this);

                // The .star-box-giga-star class was exactly where we wanted it to be.
                // To get the rating, we can simply just get the .text(), no need to traverse the DOM any further

                rating = data.children().first().children().text();
				console.log(rating);

                json.rating = rating;
            })
			
		// To write to the system we will use the built in 'fs' library.
		// In this example we will pass 3 parameters to the writeFile function
		// Parameter 1 :  output.json - this is what the created filename will be called
		// Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
		// Parameter 3 :  callback function - a callback function to let us know the status of our function

		fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

			console.log('File successfully written! - Check your project directory for the output.json file');

		});
			
		// Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
		res.send('Check your console!')

			
		}
		
		
        
    })
	
});

app.listen('901');
console.log('901! You are nice hole ;)');

exports = module.exports = app;