jsio('import timestep.View');

var Floor = exports = Class(timestep.View, function(supr) {
	
	this.init = function(opts) {
		opts = opts || {};
		supr(this, 'init', [opts]);
		
		if (typeof opts.originPoint != 'boolean') { opts.originPoint = false; }
		if (typeof opts.acceleration != 'number') { opts.acceleration = 4; }
		if (typeof opts.width != 'number') 
		{
    		this.style.width = 300 + Math.random() * 200;
		}
		if (typeof opts.height != 'number') 
		{ 
    		this.style.height = 100 + Math.random() * 50;
    	}
			
		this._originPoint = opts.originPoint;
		this._acceleration = opts.acceleration;
		
		if(!this._originPoint) this.style.x = 850 + (50 + Math.random() * 10);
		else this.style.x = 0;
				
		this.style.y = 600 - this.style.height;
		
		this._red = Math.round(Math.random() * 255);
		this._green = Math.round(Math.random() * 255);
		this._blue = Math.round(Math.random() * 255);
	}
	
	this.render = function(ctx) 
	{
   	ctx.fillStyle = 'rgb(' + this._red + ',' + this._green + ',' + this._blue + ')';
   	ctx.fillRect(0, 0, this.style.width, this.style.height);
	}
		
	this.tick = function(dt) 
	{
   	if(this.style.x + this.style.width > 0)
   	{
       	this.style.x -= this._acceleration;
   	}
   	else this._erase = true;
	}
		
});