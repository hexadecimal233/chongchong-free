require('needle').get('http://www.baidu.com', function(error, response) {
  if (!error && response.statusCode == 200)
    console.log(response.body);
});