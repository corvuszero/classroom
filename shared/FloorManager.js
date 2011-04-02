jsio('import shared.Floor as Floor');

var platforms = [];
var speed;
var acceleration;
var platformParent;

var FloorManager = exports = Class(function() 
{
	this.init = function(opts) 
	{
   	this.acceleration = opts.acceleration;
     	this.speed = opts.speed;
     	this.platformParent = opts.platformParent;

      platforms.push
      (
        new Floor
        ({
          originPoint:true,
          width: 850,
          height:250,
          parent:this.platformParent
        })
      );
	}
	
	this.checkFloors = function()
	{
   	var arrayLength = platforms.length;
   	for(i = 0; i < arrayLength; i++)
   	{
       	//new platform generation
       	if(!platforms[i]._spawnNewPlatform)
       	{
         	if(platforms[i].style.x + platforms[i].style.width <= 800)
         	{
             	platforms.push(new Floor
             	({
                parent:this.platformParent
             	}));
             	platforms[i]._spawnNewPlatform = true;
         	}
       	}
       	
       	//platform deletion
       	if(platforms[i]._erase)
       	{
         	platforms[i].removeFromSuperview();
         	platforms.splice(i, 1);
       	}
   	}
	}		
});