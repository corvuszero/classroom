jsio('import timestep.View');
jsio('import timestep.ImageView');
jsio('import timestep.Sprite');

var enemy = [];


var Enemy = exports = Class(timestep.View, function(supr) 
{

    this.deleteEnemy = false;

    this.init = function(opts) 
    {
        opts = opts || {};
        supr(this, 'init', [opts]);
        
        if (typeof opts.originPoint != 'boolean') { opts.originPoint = false; }
        if (typeof opts.acceleration != 'number') { opts.acceleration = 4; }
        if (typeof opts.width != 'number') 
        {
            this.style.width  = 86 * opts.spriteScale;
        }
        if (typeof opts.height != 'number') 
        { 
            this.style.height = 96 * opts.spriteScale;
        }
        
        this._spriteScale = opts.spriteScale;
        
        this._originPoint = opts.originPoint;
        this._acceleration = opts.acceleration;
         
        this.style.x = opts.originX;
        this.style.y = opts.originY;
        this.deleteEnemy = false;
        
        this._red = Math.round(Math.random() * 255);
        this._green = Math.round(Math.random() * 255);
        this._blue = Math.round(Math.random() * 255);
        this.drawEnemy(opts);
    }
    
    this.drawEnemy = function(opts)
    {
        enemy = new timestep.Sprite
       	({
           	x:opts.originX,
           	y:opts.originY,
           	width:72 * this._spriteScale,
           	height:84 * this._spriteScale,
           	animations:
            {
                rest:
                {
                    width:18,
                    height:21,
                    imageURL: 'images/enemy.png',
                    frameRate:16,
                    frames:
                    [
                        [0, 0],
                        [18, 0],
                        [36, 0],
                        [18, 0]                        
                    ]
                },
                knock_out:
                {
                    width:18,
                    height:21,
                    imageURL: 'images/enemy.png',
                    frameRate:4,
                    frames:
                    [
                        [59, 0]                    
                    ]
                }
            },
            defaultAnimation:'rest',
            parent:this,
            zIndex: 1
       	});
       	enemy.startAnimation('rest');
    }
    
    this.getEnemy = function()
    {
        return enemy;  
    }
    
    this.destroy = function()
    {
        // enemy.defaultAnimation = 'knock_out';
        this.deleteEnemy = true;
        enemy.startAnimation('knock_out', { callback:this.readyToDelete, iterations:1 } );
    }
    
    this.readyToDelete = function()
    {
        this.deleteEnemy = true;
        enemy.startAnimation('knock_out', { callback:this.readyToDelete, iterations:0 } );
    }
    
    this.tick = function(dt) 
    {
        if ( this.deleteEnemy )
        {
            this.removeFromSuperview();
        } 
    }

}
);