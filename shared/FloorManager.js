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
          height:100,
          parent:this.platformParent
        })
      );
	}
	
	this.getPlatforms = function()
	{
   	return platforms;
	}
	
	this.checkFloors = function()
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
                parent:this.platformParent
             	}));
         	}
       	}
       	
       	//platform deletion
       	if(platforms[i]._erase)
       	{
         	logger.log('borrado!');
         	platforms[i].removeFromSuperview();
         	platforms.splice(i, 1);
       	}
   	}
	}		
});