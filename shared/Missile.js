jsio('import timestep.View');

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
         
        this.style.x = opts.originX;
        this.style.y = opts.originY;
        
        this._red = Math.round(Math.random() * 255);
        this._green = Math.round(Math.random() * 255);
        this._blue = Math.round(Math.random() * 255);
    }

    this.render = function(ctx) 
    {
        if(ctx){
            ctx.fillStyle = 'rgb(255, 34, 0)';
            ctx.fillRect(0, 0, this.style.width, this.style.height);
        }
    };
    
    this.tick = function(dt) 
    {
    
        if ( this.fired )
        {
            if (this.style.x + this.style.width > 800)
            {
                this.style.x += this._acceleration;
            }
            else
            {
                this._erase = true;
            }
            
            this.style.x += 20;
        }
    }

}
);