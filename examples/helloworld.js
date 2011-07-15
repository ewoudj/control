var http = require('http');
var control = require('./../lib/control').control;
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(
		  
	  new control({
		  tag: 'html',
		  isRootControl: true,
		  items : [
		      {tag: 'head', items: [{tag: 'title', controlValue: 'Hello world app.'}]},
		      {tag: 'body', items: [{tag: 'h1', controlValue: 'Hello world!'}]}
		  ]
	  }).render()
	  
  );
}).listen(1337, "127.0.0.1");
console.log('Server running at http://127.0.0.1:1337/');