jsio('import timestep.View');
jsio('import timestep.ImageView');
jsio('import timestep.Sprite');


var Enemy = exports = Class(timestep.View, function(supr) 
{

    this._pause = false;
	this.enemy = null;
    this.deleteEnemy = false;
    
    // Animation
    this.movingLeft     = false;
    this.movingRight    = false;

    this.init = function(opts) 
    {
        opts = opts || {};
        supr(this, 'init', [opts]);
		
        if (typeof opts.width != 'number') 
        {
            this.style.width  = 86 * opts.spriteScale;
        }
        if (typeof opts.height != 'number') 
        { 
            this.style.height = 96 * opts.spriteScale;
        }
        
        this._spriteScale = opts.spriteScale;
         
        this.style.x 		= opts.originX;
        this.style.y 		= opts.originY;
        this.deleteEnemy 	= false;
        
        this.movingLeft     = false;
        this.movingRight    = false;
        
        var direction = Math.random() * 10;
        if ( direction > 3 )
        {
            this.movingRight    = true;
        }
        else
        {
            this.movingLeft     = true;
        }
        
        this.drawEnemy(opts);
    };
    
    this.drawEnemy = function(opts)
    {
        this.enemy = new timestep.Sprite
       	({
           	x:0,
           	y:0,
           	width:36 * this._spriteScale,
           	height:42 * this._spriteScale,
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
       	this.enemy.startAnimation('rest');
		
		var block = new timestep.View({
			x:opts.originX,
           	y:opts.originY,
           	width:72,
           	height:84,
			zIndex: 2,
			parent: this
		});
		
		block.render = function(ctx)
		{
			if(ctx)
			{
				ctx.fillStyle   = "#FF0000";
				ctx.beginPath();
				ctx.moveTo(86,0);
				ctx.moveTo(86,96);
				ctx.moveTo(0,96);
				ctx.closePath();
				ctx.fill();
			}
		};
    };
    
    this.getEnemy = function()
    {
        return this.enemy;  
    };
    
    this.destroy = function()
    {
        // enemy.defaultAnimation = 'knock_out';
        this.deleteEnemy = true;
        this.enemy.startAnimation('knock_out', { callback:this.readyToDelete, iterations:1 } );
    };
    
    this.readyToDelete = function()
    {
        this.deleteEnemy = true;
        if ( this.enemy )
        {
            this.enemy.startAnimation('knock_out', { callback:this.readyToDelete, iterations:0 } );
        }
    };
    
    this.flip = function(ctx)
    {
        ctx.scale(-1, 1);
    }
    
    this.tick = function(dt) 
    {
        if ( !this._pause )
        {
            if ( this.deleteEnemy )
            {
                this.removeFromSuperview();
            }
            
            var relativePosition = this.getPosition(this.getSuperView());
                        
            if ( this.getSuperView() != undefined )
            {
                if ( this.movingLeft )
                {
                    this.enemy._animationMirroredHorizontal = false;
                    if ( this.style.x > (this.getSuperView()._totalWidth * 0.05) )
                    {
                        this.style.x   -= 7;
                    }
                    else
                    {
                        this.enemy._animationMirroredHorizontal = true;
                        this.movingLeft  = false;
                        this.movingRight = true;
                    }
                }
                
                if ( this.movingRight )
                {
                    this.enemy._animationMirroredHorizontal = true;
                    if ( this.style.x + this.style.width < (this.getSuperView()._totalWidth) * 0.95 )
                    {
                        this.style.x    += 7;
                    }
                    else
                    {
                        this.enemy._animationMirroredHorizontal = false;
                        this.movingLeft  = true;
                        this.movingRight = false;
                    }
                }
            }
            else
            {
                //logger.log("No SuperView");
            }
        }
 
    }
});