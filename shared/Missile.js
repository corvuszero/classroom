jsio('import timestep.View');
jsio('import timestep.ImageView');
jsio('import shared.FloorManager as FloorManager');

var _runner;

var Missile = exports = Class(timestep.View, function(supr) 
{

    this._pause         = false;
    this._erase         = false;
    this._floorManager  = [];
    this._enemyIndex    = 0;
    this._fireball      = [];

    this.init = function(opts) 
    {
        opts = opts || {};
        supr(this, 'init', [opts]);
        
        if (typeof opts.acceleration != 'number') { opts.acceleration = 4; }
        if (typeof opts.width != 'number') 
        {
            this.style.width  = 38;
        }
        if (typeof opts.height != 'number') 
        { 
            this.style.height = 38;
        }
        
        this._acceleration = opts.acceleration;
         
        this.style.x = 0;
        this.style.y = 0;
        this._screenWidth = opts.screenWidth;
        
        this._red = Math.round(Math.random() * 255);
        this._green = Math.round(Math.random() * 255);
        this._blue = Math.round(Math.random() * 255);
        this._fireball = [];
        _runner = [];
        this.drawMissile(opts);
    }
    
    this.getRunner = function()
    {
        return _runner;
    }
    
    this.drawMissile = function(opts)
    {
        this._fireball = new timestep.ImageView
       	({
           	x:opts.originX,
           	y:opts.originY,
           	width:0,
           	height:0,
           	image:'images/fireball.png',
           	parent:this,
           	zIndex:0
       	});
    }
    
    this.tick = function(dt) 
    {
        if ( this._fired && !this._pause )
        {
            if (this.style.x + this.style.width < this._screenWidth)
            {
                this.style.x += this._acceleration;
            }
            else
            {
                this._erase = true;
            }            
        }
        
        var platforms = this._floorManager.getPlatforms();
        for ( var i in platforms )
        {
            var platform    = platforms[i];
            for ( var e in platform.getEnemies() )
            {
                
                if ( (platform.getEnemies())[e] != undefined && 
                    (this.style.x >= platform.style.x + (platform.getEnemies())[e].style.x + 32
                    && this.style.x <= platform.style.x + (platform.getEnemies())[e].style.x + 32 + (platform.getEnemies())[e].style.width) && 
                  this._erase == false &&
                  (this._fireball.style.y >= platform.style.y + (platform.getEnemies())[e].style.y 
                  && this._fireball.style.y <= platform.style.y + (platform.getEnemies())[e].style.y + (platform.getEnemies())[e].style.height) )
                {
                    (platform.getEnemies())[e].destroy();
                    platform.getEnemies().splice(e, 1);
                    this._erase = true;
                    this._runner.killingScore += 1;
                }
            }
        }
        
    }

}
);