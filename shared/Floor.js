jsio('import timestep.View');
jsio('import timestep.ImageView');
jsio('import timestep.Sprite as Sprite');
jsio('import shared.Enemy as Enemy');
jsio('import shared.Booster as Booster');
jsio('import shared.Obstacle as Obstacle');
jsio('import shared.GameConfig as GameConfig');

var Floor = exports = Class(timestep.View, function(supr) 
{
		
	this.init = function(opts) 
	{
	   var gameConfig = GameConfig.get();
	   this._item          = null; //Booter o lo que se nos ocurra en el futuro
       this._enemies       = [];
       this._obstacles     = [];
       this._heart         = false;
       this._totalWidth    = 0;
           
		opts = opts || {};
		supr(this, 'init', [opts]);
		this._pause = false;
		
		if (typeof opts.originPoint != 'boolean') { opts.originPoint = false; }
		if (typeof opts.acceleration != 'number') { opts.acceleration = 4; }
      
        this._screenWidth = gameConfig._deviceWidth;
        this._screenHeight = gameConfig._deviceHeight;
        this._spriteScale = gameConfig._spriteScale;

        this._spawnNewPlatform = false;
        this._defaultRows = gameConfig._defaultPlatformRows;
        this._spikesMultiple = gameConfig._spikesMultiple;
        this._spikeDivision = gameConfig._platformSpikeDivision;
        this._tileDifference = gameConfig._maximumPlatformTiles - gameConfig._minimumPlatformTiles;
        
        if(!opts.originPoint) 
        {
            this._middleTiles = gameConfig._minimumPlatformTiles + Math.round(Math.random() * this._tileDifference);
            this._middleTiles = this._middleTiles % 2 == 0 ? this._middleTiles:this._middleTiles + 1;
            this._extraRows = Math.round(Math.random() * 10);
        }
        else 
        {
            this._middleTiles = gameConfig._defaultMiddleTiles;
            this._extraRows = gameConfig._defaultExtraRows;
        }
            
        
        this.style.width = 32 * this._spriteScale * (this._middleTiles + 2);
        this.style.height = 416 * this._spriteScale;
        
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
	
	this.getItem = function()
	{
	   return this._item;   
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
       	this._totalWidth += leftSide.style.width;
       	
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
        this._totalWidth += (32 * this._middleTiles * this._spriteScale);
        
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
       	this._totalWidth += rightSide.style.width;
       	
       	this.createEnemies();
       	this.createSpikes();
       	this.createItems();
	}
	
	this.createEnemies = function()
	{
	   
	   var occupiedPositions = [ this._totalWidth * 0.25, this._totalWidth * 0.5, this._totalWidth * 0.75];
	       
	   if(!this._originPoint)
	   {
           	var numberOfEnemies     = Math.floor(Math.random() * 3);
           	var numberOfEnemiesH    = numberOfEnemies;
           	
           	for (e = 0; e < numberOfEnemies; e++)
           	{
           	    var position = (numberOfEnemiesH % 3);
           	    numberOfEnemiesH++;
           	    
           	    var enemy = new Enemy(
               	    {
                        parent:this,
                        originX:occupiedPositions[position],
                        originY:-42 * this._spriteScale,
                        spriteScale:this._spriteScale
               	    }
           	    );
           	    this._enemies.push(enemy);
           	}
	   }
	}
	
	/**
    * Spikes generation function
    **/
	this.createSpikes = function()
	{
       	if(!this._originPoint)
       	{
       	    var mySpikeDivision = 2 + Math.floor(Math.random() * (this._spikeDivision - 2));
       	    var divisionUnit = 1 / mySpikeDivision;
       	    var occupiedPositions = [];
       	    var divisionCounter = 1;
       	    for(divisionCounter; divisionCounter < mySpikeDivision; divisionCounter+=2)
       	    {
       	        var createdPosition = Math.floor(32 * this._spriteScale * this._middleTiles * divisionCounter * divisionUnit);
       	        occupiedPositions.push(createdPosition);
       	    }
       	    
    	    var spCounter = 0;
        	for (spCounter; spCounter < occupiedPositions.length; spCounter++ )
        	{
        	    var tempSpikeSize = (1 + Math.floor(Math.random() * (this._spikesMultiple - 1))) * 2;
                var position = Math.floor(Math.random() * (occupiedPositions.length - 1));
                var obstaclePosition = occupiedPositions[position];
                occupiedPositions.splice(position, 1);
                
                this._obstacles.push(new Obstacle
                    ({
                        parent:this,
                        originX: 32 + obstaclePosition - (25 * this._spriteScale * tempSpikeSize),
                        originY:-42 * this._spriteScale,
                        spriteScale:this._spriteScale,
                        spikeSize:tempSpikeSize
                    })
                );
            }
            
       	}
	}
	
	this.createItems = function()
	{
	   var diceRoll = Math.random();
	   
	   if(diceRoll > 0.5)
	   {
	       this._item = new Booster
	       ({
	           parent:this,
	           x:this.style.width / 2,
	           y:-60 * this._spriteScale,
	       });
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