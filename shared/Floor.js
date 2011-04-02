jsio('import timestep.View');

var originPoint = false;
var acceleration = 4;
var red;
var green;
var blue;

var Floor = exports = Class(timestep.View, function(supr) {
	
	this.init = function(opts) {
		opts = opts || {};
		supr(this, 'init', [opts]);
		
		if (typeof opts.originPoint != 'boolean') { opts.originPoint = false; }
		if (typeof opts.acceleration != 'number') { opts.acceleration = acceleration; }
		if (typeof opts.width != 'number') 
		{
    		this.style.width = Math.random() * 500 + 50;
		}
		if (typeof opts.height != 'number') 
		{ 
    		this.style.height = Math.random() * 300 + 50;
    	}
			
		this.originPoint = opts.originPoint;
		this.acceleration = opts.acceleration;
		
		if(!this.originPoint) this.style.x = Math.random() * 30 + 815;
		else this.style.x = 0;
				
		this.style.y = 600 - this.style.height;
		
		red = Math.round(Math.random() * 255);
		green = Math.round(Math.random() * 255);
		blue = Math.round(Math.random() * 255);
	}
	
	this.render = function(ctx) 
	{
   	ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
   	ctx.fillRect(0, 0, this.style.width, this.style.height);
	}
		
	this.tick = function(dt) 
	{
   	if(this.style.x + this.style.width > 0)
   	{
       	this.style.x -= acceleration;
   	}
   	else delete this;
	}
		
});