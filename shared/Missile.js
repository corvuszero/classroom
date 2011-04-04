jsio('import timestep.View');
jsio('import timestep.ImageView');
jsio('import shared.FloorManager as FloorManager');

var Missile = exports = Class(timestep.View, function(supr) 
{

    this._pause         = false;
    this._erase         = false;
    this._floorManager  = [];
    this._enemyIndex    = 0;
    this._enemy         = [];

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
    }
    
    this.tick = function(dt) 
    {
        if ( this._fired && !this._pause )
        {
            if (this.style.x + this.style.width < 800)
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
                var enemy = (platform.getEnemies())[e];
                if ( enemy != undefined && this.style.x >= platform.style.x + enemy.style.x + 32 )
                {
                    this._enemyIndex = e;
                    this._enemy      = enemy;
                    enemy.getEnemy().startAnimation('knock_out', { callback:this.removeEnemy, iterations:0 } );
                    this._erase = true;
                }
            }
        }
        
    }
    
    this.removeEnemy = function()
    {
        if ( this._enemy != undefined )
        {
            logger.log("Removing Enemy");
            this._enemy.removeFromSuperview();
            platform.getEnemies().splice(this._enemyIndex, 1);
            
        }
        this._erase = true;
    }

}
);