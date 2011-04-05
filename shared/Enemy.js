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
           	width:86 * this._spriteScale,
           	height:96 * this._spriteScale,
           	animations:
            {
                rest:
                {
                    width:86,
                    height:96,
                    imageURL: 'images/enemy.png',
                    frameRate:4,
                    frames:
                    [
                        [0, 0],
                        [86, 0],
                        [172, 0]
                    ]
                },
                knock_out:
                {
                    width:86,
                    height:96,
                    imageURL: 'images/enemy.png',
                    frameRate:4,
                    frames:
                    [
                        [258, 0],
                        [344, 0]
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