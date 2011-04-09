jsio('import timestep.View');
jsio('import timestep.ImageView');
jsio('import shared.FloorManager as FloorManager');

var _runner;

var Missile = exports = Class(timestep.View, function(supr) 
{

    this._pause             = false;
    this._erase             = false;
    this._enemyIndex        = 0;
    this._fireball          = [];
    this._floorManagerOpts  = {};

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
        this.zIndex         = 4;    
        this._acceleration  = opts.acceleration;
         
        this.style.x            = opts.originX;
        this.style.y            = opts.originY;
        this._screenWidth       = opts.screenWidth;
        this._fireball          = {};
        this._floorManagerOpts  = {};
        _runner                 = {};
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
           	x:0,
           	y:0,
           	width:38,
           	height:38,
           	image:'images/fireball.png',
           	parent:this,
           	zIndex:1
       	});
    }
    
    this.setFloorManagerOptions = function(opts)
    {
        this._floorManagerOpts = opts;
    }
    
    this.getFloorManagerInstance = function()
    {
        var floorManager = {};
        
        if ( this._floorManagerOpts != null )
        {
            floorManager = FloorManager.get(
                {
                    acceleration:this._floorManagerOpts.acceleration,
                    speed:this._floorManagerOpts.speed,
                    platformParent:this._floorManagerOpts.runnerView
                }
            );
        }
        
        return floorManager;
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
        
        var platforms = this.getFloorManagerInstance().getPlatforms();
        for ( var i in platforms )
        {
            var enemies    = platforms[i].getEnemies(); 
            for ( var e in enemies )
            {
                var enemy           = enemies[e];
                var enemyPosition   = enemy.getPosition(this.getSuperView());
                if (this.style.x + this.style.width/2 >= enemyPosition.x
                    && (
                            (this.style.y + 5 >= enemyPosition.y +5 && this.style.y + 5 < enemyPosition.y + enemy.style.height -5)
                            ||
                            (this.style.y + this.style.height - 5 >= enemyPosition.y + 5 && this.style.y + this.style.height-5 < enemyPosition.y + enemy.style.height - 5)
                        )
                    )
                {
                    enemy.destroy();
                    enemies.splice(e, 1);
                    this._erase = true;
                    this._runner.killingScore += 1;
                }
            }
        }
        
    }

}
);