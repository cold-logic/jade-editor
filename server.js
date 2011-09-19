var express = require('express')
 ,  fs = require('fs')
 ,  path = require('path')
 
var app = express.createServer(
    express.static(path.join(__dirname, 'public'))
)

app.set('view engine', 'jade')


app.get('/', function (request, response) {
    //response.render('meepbop', { layout: false });
})

var templatePath = path.join(__dirname, 'features/templates')
app.get('/templates/:name', function (request, response) {
    fs.readFile(path.join(templatePath, request.params.name + '.jade'), function(err, data) {
        response.send(err ? { err: err } : { template: data.toString() });
    })
    
})


var port = 11848 // 80;
app.listen(port)
console.log('Jade-editor started on port ' + port)