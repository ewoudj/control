function getType(v) {
  if (typeof(v) == "object") {
    if (v === null) return "null";
    if (v.constructor == (new Array).constructor) return "array";
    if (v.constructor == (new Date).constructor) return "date";
    if (v.constructor == (new RegExp).constructor) return "regex";
    return "object";
  }
  return typeof(v);
}

var merge = function(a, b){
	if (a && b) {
		for (var key in b) {
			a[key] = b[key];
		}
	}
	return a;
};

Function.prototype.scope = function(scope) {
	var _function = this; 
	return function() {
		return _function.apply(scope, arguments);
	};
};

Function.prototype.inheritsFrom = function( parentClassOrObject ){ 
	if ( parentClassOrObject.constructor == Function ) { 
		//Normal Inheritance 
		var tmp = function(){};
		tmp.prototype = parentClassOrObject.prototype;
		this.prototype = new tmp;//new parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.baseClass = parentClassOrObject.prototype;
	} 
	else { 
		//Pure Virtual Inheritance 
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.baseClass = parentClassOrObject;
	} 
	return this;
}; 


var control = function(config){
	this.originalConfig = config;
	if(config){
		merge(this, config);
	}
	if(!(this.parentControl || this.rootControl)){
		debugger;
		throw 'Error: the parentControl field is not set';
	}
	if(this.items){
		var controlItems = [];
		for(var i = 0; i < this.items.length; i++){
			var itemConfig = this.items[i];
			if(!itemConfig){
				debugger;
				throw 'Error: control.items cannot contain null values';
			}
			itemConfig.parentControl = this;
			var newControlItem = null;
			if(itemConfig.controlType && getType(itemConfig) !== 'function' ){
				newControlItem = new control.registry[itemConfig.controlType](itemConfig);
			}
			else{
				newControlItem = new control(itemConfig);
			}
			if(newControlItem.name){
				this[newControlItem.name] = newControlItem;
			}
			controlItems.push(newControlItem);
		}
		this.items = controlItems;
	}
	this.initialized = false;
};

control.registry = {};

control.prototype.render = function(){
	var result = '';
	var attributesString = '';
	var itemsString = '';
	if(!this.initialized){
		if(this.attributes){
			for(var attributeName in this.attributes){
				if(this.attributes[attributeName] != null){
					var attributeValue = this.attributes[attributeName].toString();
					if(attributeValue){
						attributesString += (' ' + (attributeName === 'cls' ? 'class' : attributeName) + '="' + attributeValue + '"' );
					}
				}
			}
			if(attributesString){
				attributesString += ' ';
			}
		}
		this.pre = '<'+ (this.tag || 'div') + attributesString + '>';
		this.post = this.voidElement ? '' : ('</' + (this.tag || 'div') + '>');
		this.initialized = true;
	}
	if(this.items){
		var parts = [];
		for(var i = 0; i < this.items.length; i++){
			parts.push(this.items[i].render());
		}
		itemsString = parts.join('');
	}
	result = this.pre + itemsString + (this.controlValue || '') + this.post;
	return result;
};

control.prototype.bind = function(rootElement){
	this.element = rootElement;
	if(this.items){
		for(var i = 0; i < this.items.length; i++){
			this.items[i].bind(this.element.childNodes[i]);
		}
	}
	if(this.events){
		for(var e in this.events){
			this.element[e] = this.events[e].scope(this);
		}
	}
};
/*
 *  Controls that are in a busy state report so to their parent using the busy function 
 */
control.prototype.busy = function(asyncControl){
	if(!this.waitingFor){
		this.waitingFor = [];
	}
	if(this.waitingFor.indexOf(asyncControl) === -1){
		this.waitingFor.push(asyncControl);
	}
	if(this.parentControl){
		this.parentControl.busy(this);
	}
	else if(!this.rootControl) {
		debugger;
		throw 'Error: the parentControl field is not set';
	}
};
/*
 * Controls that previously reported themselves as busy use the done function when ready
 */
control.prototype.done = function(asyncControl){
	var err1 = 'Error: A control reported it was done but nothing was waiting for it. This should not never happen.';
	if(!this.waitingFor){
		debugger;
		throw err1;
	}
	var i = this.waitingFor.indexOf(asyncControl);
	if(i === -1){
		debugger;
		throw err1;
	}
	this.waitingFor.splice(i, 1);
	if(this.waitingFor.length === 0){
		if(this.parentControl){
			this.parentControl.done(this);
		}
		else if(!this.rootControl) {
			debugger;
			throw 'Error: the parentControl field is not set';
		}
		if(this.waiters){
			for(var i = 0; i < this.waiters.length; i++){
				this.waiters[i]();
			}
			this.waiters =[];
		}
	}
};
/*
 * Returns true if not waiting for any results
 */
control.prototype.isReady = function(){
	return (!this.waitingFor || this.waitingFor.length === 0);
};
/*
 * Handlers will be called after all work is done after a busy state
 */
control.prototype.ready = function(handler){
	if(this.isReady()){
		handler();
	}
	else{
		if(!this.waiters){
			this.waiters = [];
		}
		this.waiters.push(handler);
	}
};


control.prototype.on = function(eventName, handler){
	if(!this.observers){
		this.observers = {};
	}
	if(!this.observers[eventName]){
		this.observers[eventName] = [];
	}
	this.observers[eventName].push(handler);
};

control.prototype.fire = function(eventName, eventData){
	if(this.observers && this.observers[eventName]){
		var observers = this.observers[eventName];
		for(var i = 0; i < observers.length; i++){
			observers[i](this, eventName, eventData);
		}
	}
};

exports = module.exports = {
	control : control,
	utils	: {
		merge: merge
	}
};