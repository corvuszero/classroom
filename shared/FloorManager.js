jsio('import shared.Floor as Floor');

var platforms = [];
var speed;
var platformParent;

var FloorManager = exports = Class(function() 
{
	this.init = function(opts) 
	{
      this._platformCounter = 0;
      this._levelCounter = 0;
      this._platformsToIncreaseLevel = 15;
      this._acceleration = opts.acceleration;
   	  this._originalAcceleration = this._acceleration;
   	  this._pause = false;
      this.speed = opts.speed;
      this.platformParent = opts.platformParent;

      platforms.push
      (
        new Floor
        ({
          acceleration:this._acceleration,
          originPoint:true,
          parent:this.platformParent
        })
      );
	}
	
	this.restart = function()
	{
	   while(platforms.length > 0)
	   {
	       platforms[0].removeFromSuperview();
           platforms.splice(0, 1);
	   }
	   
	   this.platformCounter = 0;
       this._levelCounter = 0;
       this._acceleration = this._originalAcceleration;
   	   this._pause = false;

       platforms.push
       (
        new Floor
        ({
          acceleration:this._acceleration,
          originPoint:true,
          parent:this.platformParent
        })
       );
	}
	
	this.getPlatforms = function()
	{
   	return platforms;
	}
	
	this.setPause = function(value)
	{
   	this._pause = value;
      for(i = 0; i < platforms.length; i++)
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
             	if(platforms[i].style.x + platforms[i].style.width <= 800)
             	{
                 	platforms[i]._spawnNewPlatform = true;
                 	platforms.push(new Floor
                 	({
                   	acceleration:this._acceleration,
                   	parent:this.platformParent
                 	}));
                 	
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
});