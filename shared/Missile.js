jsio('import timestep.View');
jsio('import timestep.ImageView');

var Missile = exports = Class(timestep.View, function(supr) 
{

    this.init = function(opts) 
    {
        opts = opts || {};
        supr(this, 'init', [opts]);
        
        if (typeof opts.originPoint != 'boolean') { opts.originPoint = false; }
        if (typeof opts.acceleration != 'number') { opts.acceleration = 4; }
        if (typeof opts.width != 'number') 
        {
            this.style.width  = 30;
        }
        if (typeof opts.height != 'number') 
        { 
            this.style.height = 30;
        }
        
        this._originPoint = opts.originPoint;
        this._acceleration = opts.acceleration;
         
        this.style.x = 0;
        this.style.y = 0;
        
        this._red = Math.round(Math.random() * 255);
        this._green = Math.round(Math.random() * 255);
        this._blue = Math.round(Math.random() * 255);
        this.drawMissile(opts);
    }
    
    this.drawMissile = function(opts)
    {
        var fireball = new timestep.ImageView
       	({
           	x:opts.originX,
           	y:opts.originY,
           	originPoint:opts.originPoint,
           	width:0,
           	height:0,
           	image:'images/fireball.png',
           	parent:this,
           	zIndex:0
       	});
       	//this.render();
    }

    /*this.render = function(ctx) 
    {
        if(ctx)
        {
            ctx.fillStyle = 'rgb(255, 34, 0)';
            ctx.fillRect(0, 0, this.style.width, this.style.height);
        }
    };*/
    
    this.tick = function(dt) 
    {
        if ( this.fired )
        {
            if (this.style.x + this.style.width < 800)
            {
                this.style.x += this._acceleration;
            }
            else
            {
                this.removeFromSuperview();
            }            
        }
    }

}
);