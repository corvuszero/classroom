jsio('import timestep.View');
jsio('import timestep.ImageView');
jsio('import shared.Enemy as Enemy');
jsio('import shared.Obstacle as Obstacle');

var Floor = exports = Class(timestep.View, function(supr) 
{
	
	this.init = function(opts) 
	{
        this._enemies       = [];
        this._obstacles     = [];
        this._heart         = false;
        this._totalWidth    = 0;
           
		opts = opts || {};
		supr(this, 'init', [opts]);
		this._pause = false;
		
		if (typeof opts.originPoint != 'boolean') { opts.originPoint = false; }
		if (typeof opts.acceleration != 'number') { opts.acceleration = 4; }
      
        this._screenWidth = opts.screenWidth;
        this._screenHeight = opts.screenHeight;
        this._spriteScale = opts.spriteScale;

        this._spawnNewPlatform = false;
        this._defaultRows = opts.defaultRows;
        this._tileDifference = opts.maximumTiles - opts.minimumTiles;
        
        if(!opts.originPoint) 
        {
            this._middleTiles = opts.minimumTiles + Math.round(Math.random() * this._tileDifference);
            this._extraRows = Math.round(Math.random() * 10);
        }
        else 
        {
            this._middleTiles = opts.defaultMiddleTiles;
            this._extraRows = opts.defaultExtraRows;
        }
            
        
        this.style.width = 32 * this._spriteScale * (this._middleTiles + 2);
        this.style.height = 416;
        
        this._originPoint = opts.originPoint;
        this._acceleration = opts.acceleration;
        
        var maxDistance = 22 * this._spriteScale * this._acceleration;
        if(!this._originPoint)
            this.style.x = this._screenWidth + 50 + Math.round(50 + Math.random() * (maxDistance - 50));
        else 
            this.style.x = 0;
        
        this.style.y = this._screenHeight - (32 * this._spriteScale * (this._defaultRows + this._extraRows));
        this.createPlatform();
	}
	
	this.getEnemies = function()
	{
	   return this._enemies;
	}
	
	this.getObstacles = function()
	{
	   return this._obstacles;
	}
    
    this.getHeart = function()
    {
        return this._heart;
    }
	
	this.createPlatform = function()
	{
       	//Start
       	var leftSide = new timestep.ImageView
       	({
            x:0,
            y:0,
            width:32 * this._spriteScale,
            height:416 * this._spriteScale,
            image:'images/leftPlatform.png',
            parent:this,
            zIndex:0
       	});
       	this._totalWidth += this._spriteScale;
       	
       	var middleOfPlatform;
       	for(i = 1; i < this._middleTiles; i++)
       	{
           	middleOfPlatform = new timestep.ImageView
           	({
             	x: i * 32 * this._spriteScale,
             	y: 0,
             	width:32 * this._spriteScale,
             	height:416 * this._spriteScale,
             	parent:this,
             	image:'images/middlePlatform.png',
             	zIndex:i
           	});
        }
        this._totalWidth += 32 * this._middleTiles * this._spriteScale;
        
       	var rightSide = new timestep.ImageView
       	({
            x: this._middleTiles * 32 * this._spriteScale,
            y:0,
            width:32 * this._spriteScale,
            height:416 * this._spriteScale,
            parent:this,
            image:'images/rightPlatform.png',
            zIndex:this._middleTiles
       	});
       	this._totalWidth += this._spriteScale;
       	       	
       	if(!this._originPoint)
       	{
           	var numberOfEnemies = Math.floor(Math.random() * 4);
           	
           	for (e = 0; e < numberOfEnemies; e++)
           	{
           	    var enemy = new Enemy(
               	    {
                        parent:this,
                        originX:((this.style.width/2 * this._spriteScale) + Math.floor( ( Math.random() * (e+1) * (this._middleTiles/7) ) ) ),
                        originY:-42 * this._spriteScale,
                        spriteScale:this._spriteScale
               	    }
           	    );
           	    this._enemies.push(enemy);
           	}
           	
           	var tempNumberOfSpikes  = Math.floor(Math.random() * 2);
           	
           	if ( tempNumberOfSpikes > 0 )
           	{
               	for ( var spCounter = 0; spCounter < tempNumberOfSpikes; spCounter++ )
               	{
               	    var tempSpikeSize = Math.floor(Math.random() * 4) + 1;
                                    
                    var obstacle = new Obstacle(
                        {
                            parent:this,
                            originX:((this.style.width/3 * this._spriteScale) + Math.floor( Math.random() * this.style.width/9 )),
                            originY:-42 * this._spriteScale,
                            spriteScale:this._spriteScale,
                            spikeSize:tempSpikeSize
                        }
                    );
                    this._obstacles.push(obstacle);  	
                }
            }
            
            
            if (Math.floor(Math.random() * 100) > 90)
            {
                this._heart = new timestep.ImageView
                ({
                  x:(Math.floor( Math.random() * this.style.width * this._spriteScale) - 16),
                  y:-100 *this._spriteScale,
                  width:  32 * this._spriteScale,
                  height: 28 * this._spriteScale,
                  originPoint:false,
                  image:'images/heart.png',
                  parent:this,
                  zIndex:1
                });
            }
       	}       	
	}
	
	this.tick = function(dt) 
	{
       	if(!this._pause)
       	{
           	if(this.style.x + this.style.width > 0)
           	{
               	this.style.x -= this._acceleration;
           	}
           	else 
           	{
           	    this._erase = true;
           	}
       	}
	}
		
});