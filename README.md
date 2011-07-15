JavaScript control base class for both server and client side GUI development. Control is the opposite of templating. Currently the API is not stable.

Control.js is for people who prefer their HTML / DOM generating user interface code (server and client) completely written in JavaScript.
Control.js aims to be small. Control.js is used extensively by Framework.js that aims to be large.

Example:

	new control({
		  tag: 'html',
		  isRootControl: true,
		  items : [
		      {tag: 'head', items: [{tag: 'title', controlValue: 'Hello world app.'}]},
		      {tag: 'body', items: [{tag: 'h1', controlValue: 'Hello world!'}]}
		  ]
	}).render()