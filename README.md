[![build status](https://secure.travis-ci.org/ewoudj/control.png)](http://travis-ci.org/ewoudj/control)
JavaScript control base class for both server and client side GUI development. Control is the opposite of templating. Currently the API is not stable.

Control.js is for people who prefer their HTML / DOM generating user interface code (server and client) completely written in JavaScript.
Control.js aims to be small. Control.js is used extensively by Framework.js that aims to be large.

Installation

	npm install controljs

Example usage:

	new control({
		  tag: 'html',
		  isRootControl: true,
		  items : [
		      {tag: 'head', items: [{tag: 'title', controlValue: 'Hello world app.'}]},
		      {tag: 'body', items: [{tag: 'h1', controlValue: 'Hello world!'}]}
		  ]
	}).render()
	
Resulting HTML:

	<html>
		<head>
			<title>Hello world app.</title>
		</head>
		<body>
			<h1>Hello world!</h1>
		</body>
	</html>