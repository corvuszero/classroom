jsio('import shared.Floor as Floor');
jsio('import shared.GameConfig as GameConfig');

var instance = null;
var platforms = [];
var speed;
var platformParent;

var FloorManager = exports = Class(function() 
{
	this.init = function(opts) 
	{
        this._gameConfig = GameConfig.get();
        this._platformCounter = 0;
        this._levelCounter = 0;
        this._platformsToIncreaseLevel = (this._gameConfig)._platformsToIncreaseLevel;
        this._acceleration = opts.acceleration;
    	  this._originalAcceleration = this._acceleration;
    	  this._pause = false;
        this.speed = opts.speed;
        this.platformParent = opts.platformParent;

        platforms.push(this.getNewPlatform(true));
	}
	
	this.restart = function()
	{
	   while(platforms.length > 0)
	   {
	       platforms[0].removeFromSuperview();
           platforms.splice(0, 1);
	   }
	   
	   this._platformCounter = 0;
       this._levelCounter = 0;
       this._acceleration = this._originalAcceleration;
   	   this._pause = false;

       platforms.push(this.getNewPlatform(true));
	}
	
	this.getPlatforms = function()
	{
   	return platforms;
	}
	
	this.setPause = function(value)
	{
       	this._pause = value;
       	var platformLength = platforms.length;
        for(i = 0; i < platformLength; i++)
        {
            platforms[i]._pause = value;
        }       	
	}
	
	this.checkFloors = function()
	{
   	if(!this._pause)
   	{
       	for(i = 0; i < platforms.length; i++)
       	{       	
           	//new platform generation
           	if(!platforms[i]._spawnNewPlatform)
           	{
             	if(platforms[i].style.x + platforms[i].style.width <= this._gameConfig._deviceWidth)
             	{
                 	platforms[i]._spawnNewPlatform = true;
                 	platforms.push(this.getNewPlatform(false));
                 	
                 	//Difficulty Increasing
                 	this._platformCounter++;
                 	this._levelCounter = Math.round(this._platformCounter / this._platformsToIncreaseLevel);
                 	var previousAcceleration = this._acceleration;
                 	this._acceleration = this._originalAcceleration + this._levelCounter;
                 	
                 	if(previousAcceleration != this._acceleration)
                 	{
                     	for(j = 0; j < platforms.length; j++)
                     	{
                       	platforms[j]._acceleration = this._acceleration;
                     	}
                 	}
             	}
           	}
           	
           	//platform deletion
           	if(platforms[i] != undefined && platforms[i]._erase)
           	{
             	platforms[i].removeFromSuperview();
             	platforms.splice(i, 1);
           	}
       	}
   	}
	}
	
	this.getNewPlatform = function(isOriginPoint)
	{
	   return new Floor
       ({
            acceleration:this._acceleration,
            originPoint:isOriginPoint,
            defaultRows:(this._gameConfig)._defaultPlatformRows,
            defaultExtraRows:(this._gameConfig)._defaultExtraRows,
            defaultMiddleTiles:(this._gameConfig)._defaultMiddleTiles,
            minimumTiles:(this._gameConfig)._minimumPlatformTiles,
            maximumTiles:(this._gameConfig)._maximumPlatformTiles,
            spikesMultiple:(this._gameConfig)._spikesMultiple,
            spikeDivision:(this._gameConfig)._platformSpikeDivision,
            parent:this.platformParent,
            spriteScale:(this._gameConfig)._spriteScale,
            screenWidth:(this._gameConfig)._deviceWidth,
            screenHeight:(this._gameConfig)._deviceHeight
       });
	}
	
	this.decreaseAcceleration = function()
    {
        this._acceleration *= 0.85;
        this._originalAcceleration *= 0.85;
        
        for ( var i in platforms )
        {
            platforms[i]._acceleration = this._acceleration;
        }
    }
    
});

/**
* Se pone al final porque arriba se asigna exports a la clase FloorManager
**/
exports.get = function(opts)
{
    if(instance) return instance;
    else instance = new FloorManager(opts);
    
    return instance;
}
