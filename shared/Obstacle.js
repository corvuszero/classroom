jsio('import timestep.ImageView');
jsio('import timestep.View');

var Obstacle = exports = Class(timestep.View, function(supr) 
{
    this._pause     = false;
	
    this.init = function(opts) 
    {
        opts = opts || {};
        supr(this, 'init', [opts]);
		
        if (typeof opts.width != 'number') 
        {
            this.style.width  = 50 * opts.spriteScale * (opts.spikeSize+1);
        }
        if (typeof opts.height != 'number') 
        { 
            this.style.height = 50 * opts.spriteScale;
        }
        
        this._spikeSize         = opts.spikeSize;
        this._spriteScale       = opts.spriteScale;
         
        this.style.x 		= opts.originX;
        this.style.y 		= opts.originY;
        
        this.movingLeft     = false;
        this.movingRight    = false;
        
        this.drawObstacle(opts);
    };
    
    this.drawObstacle = function(opts)
    {
        var tempObstacle;
        for ( var i = 0; i < this._spikeSize + 1; i++ )
        {
            tempObstacle = new timestep.ImageView
           	({
               	x:i * 50,
               	y:0,
               	width:50 * this._spriteScale,
               	height:50 * this._spriteScale,
               	image:'images/obstacle.png',
                parent:this,
                zIndex:-1
           	});
       	}
    };    
});