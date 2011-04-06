jsio('import timestep.ImageView');
jsio('import timestep.View');

var Obstacle = exports = Class(timestep.View, function(supr) 
{

    this._pause     = false;
    this.obstacle   = null;

    this.init = function(opts) 
    {
        opts = opts || {};
        supr(this, 'init', [opts]);
		
        if (typeof opts.width != 'number') 
        {
            this.style.width  = 50 * opts.spriteScale;
        }
        if (typeof opts.height != 'number') 
        { 
            this.style.height = 50 * opts.spriteScale;
        }
        
        this._spriteScale = opts.spriteScale;
         
        this.style.x 		= opts.originX;
        this.style.y 		= opts.originY;
        
        this.movingLeft     = false;
        this.movingRight    = false;
        
        this.drawObstacle(opts);
    };
    
    this.drawObstacle = function(opts)
    {
        this.obstacle = new timestep.ImageView
       	({
           	x:0,
           	y:0,
           	width:50 * this._spriteScale,
           	height:50 * this._spriteScale,
           	image:'images/obstacle.png',
            parent:this,
            zIndex:-1
       	});
    };
    
    this.tick = function(dt) 
    {
    };
    
});