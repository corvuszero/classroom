jsio('import timestep.View');
jsio('import timestep.ImageView');
jsio('import timestep.Sprite');


var Enemy = exports = Class(timestep.View, function(supr) 
{
	this.enemy = null;
    this.deleteEnemy = false;

    this.init = function(opts) 
    {
        opts = opts || {};
        supr(this, 'init', [opts]);
		
        if (typeof opts.width != 'number') 
        {
            this.style.width  = 86;
        }
        if (typeof opts.height != 'number') 
        { 
            this.style.height = 96;
        }
         
        this.style.x = opts.originX;
        this.style.y = opts.originY;
        this.deleteEnemy = false;
        this.drawEnemy(opts);
		logger.log(this);
		logger.log(this.getBoundingShape());
    };
    
    this.drawEnemy = function(opts)
    {
        this.enemy = new timestep.Sprite
       	({
           	x:0,
           	y:0,
           	width:86,
           	height:96,
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
       	this.enemy.startAnimation('rest');
		
		var block = new timestep.View({
			x:opts.originX,
           	y:opts.originY,
           	width:86,
           	height:96,
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
        this.enemy.startAnimation('knock_out', { callback:this.readyToDelete, iterations:0 } );
    };
    
    this.tick = function(dt) 
    {
        if ( this.deleteEnemy )
        {
            this.removeFromSuperview();
        } 
    };
}
);