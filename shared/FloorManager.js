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
	   if(!instance)
	   {
            this._gameConfig = GameConfig.get();
            this._platformCounter = 0;
            this._levelCounter = 0;
            this._platformsToIncreaseLevel = (this._gameConfig)._platformsToIncreaseLevel;
            this._accelerationModifier = null;
            this._acceleration = opts.acceleration;
            this._originalAcceleration  = this._acceleration;
            this._decelerationRadio = 1;
            this._pause = false;
            this.speed = opts.speed;
            this.platformParent = opts.platformParent;
    
            platforms.push(this.getNewPlatform(true));
	       
	   }else throw "Already Initialized";
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
       this._decelerationRadio = 1;
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
                 	this.executeItemLogic();
                 	
                 	/*if ( this._deccelerationRadio <= 1 )
                 	{
                        this._deccelerationRadio += 0.01;
                 	}
                 	else
                 	{
                        this._deccelerationRadio = 1;
                 	}*/
                 	
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
            parent:this.platformParent,
       });
	}
	
	this.decreaseAcceleration = function()
    {
        if ( (this._acceleration * this._decelerationRadio >= this._originalAcceleration * 0.5 ) )
        {
            //this._decelerationRadio -= 0.03; 
            this._acceleration      *= this._decelerationRadio;
            
            for ( var i in platforms )
            {
                platforms[i]._acceleration = this._acceleration;
            }
        }
    }
    
    this.executeItemLogic = function()
    {
        if(this._accelerationModifier != null)
        {
            switch(this._accelerationModifier.property)
            {
                case 'acceleration':
                    if(this._acceleration != this._accelerationModifier.peakAcceleration)
                    {
                        this._acceleration += this._accelerationModifier._magnitude * this._accelerationModifier.accelerationInterval;
                        
                        //Va subiendo y lo queremos bajar
                        if( this._accelerationModifier.magnitude == 1 && 
                            this._accelerationModifier.peakAcceleration < this._acceleration)
                        {
                            this._accelerationModifier.magnitude = -1;
                        }
                        //Va bajando y lo queremos subir
                        if( this._accelerationModifier.magnitude == -1 &&
                            this._accelerationModifier.peakAcceleration > this._acceleration)
                        {
                            this._accelerationModifier.magnitude = 1;
                        }
                        
                        if( this._accelerationModifier.magnitude == -1 &&
                            this._acceleration <= this._accelerationModifier.previousAcceleration)
                        {
                            this._acceleration = this._accelerationModifier.previousAcceleration;
                            this._accelerationModifier = null;    
                        }
                        
                        if( this._accelerationModifier.magnitude == 1 && 
                            this._acceleration >= this._accelerationModifier.previousAcceleration)
                        {
                            this._acceleration = this._accelerationModifier.previousAcceleration;
                            this._accelerationModifier = null;
                        }
                    }
                break;
                
                default:
            }
        }
    }
    
});

/**
* Se pone al final porque arriba se asigna exports a la clase FloorManager
**/
exports.get = function(opts)
{
    if(instance){ 
           return instance;
    } else {
        instance = new FloorManager(opts);
    }
    return instance;
}
