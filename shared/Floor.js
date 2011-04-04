jsio('import timestep.View');
jsio('import timestep.ImageView');
jsio('import shared.Enemy as Enemy');

var Floor = exports = Class(timestep.View, function(supr) 
{
	
	this.init = function(opts) 
	{
		opts = opts || {};
		supr(this, 'init', [opts]);
		this._pause = false;
		
		if (typeof opts.originPoint != 'boolean') { opts.originPoint = false; }
		if (typeof opts.acceleration != 'number') { opts.acceleration = 4; }
      
        this._spawnNewPlatform = false;
        if(!opts.originPoint) 
            this._middleTiles = 10 + Math.round(Math.random() * 25);
        else 
            this._middleTiles = 30;
            
        this._extraRows = Math.round(Math.random() * 10);
        
        this.style.width = 32 * (this._middleTiles + 2);
        this.style.height = 96 + (32 * this._extraRows);
        
        this._originPoint = opts.originPoint;
        this._acceleration = opts.acceleration;
        
        var maxDistance = 22 * this._acceleration;
        if(!this._originPoint)
            this.style.x = 850 + Math.round(50 + Math.random() * (maxDistance - 50));
        else 
            this.style.x = 0;
        
        this.style.y = 600 - this.style.height;        
        this.createPlatform();
	}
	
	this.createPlatform = function()
	{
       	//Empecemos
       	var leftSide = new timestep.ImageView
       	({
            x:0,
            y:0,
            width:32,
            height:96,
            image:'images/leftPlatform.png',
            parent:this,
            zIndex:0
       	});
       	
       	var middleOfPlatform;
       	for(i = 1; i < this._middleTiles; i++)
       	{
           	middleOfPlatform = new timestep.ImageView
           	({
             	x: i * 32,
             	y: 0,
             	width:32,
             	height:96,
             	parent:this,
             	image:'images/middlePlatform.png',
             	zIndex:i
           	});
        }
        
       	var rightSide = new timestep.ImageView
       	({
            x: this._middleTiles * 32,
            y:0,
            width:32,
            height:96,
            parent:this,
            image:'images/rightPlatform.png',
            zIndex:this._middleTiles
       	});
       	
       	for(i = 0; i < this._extraRows; i++)
       	{
         	var leftTile = new timestep.ImageView
         	({
              x: 0,
              y:96 + (i * 32),
              width:32,
              height:32,
              parent:this,
              image:'images/leftTile.png',
         	});
         	
         	for(j = 1; j < this._middleTiles; j++)
         	{
             	var middleTile = new timestep.ImageView
             	({
                  x: j * 32,
                  y:96 + (i * 32),
                  width:32,
                  height:32,
                  parent:this,
                  image:'images/middleTile.png',
             	});
         	}
       	
         	var rightTile = new timestep.ImageView
         	({
              x: this._middleTiles * 32,
              y:96 + (i * 32),
              width:32,
              height:32,
              parent:this,
              image:'images/rightTile.png',
         	});
       	}
       	
       	var enemies         = [];
       	var numberOfEnemies = Math.floor(Math.random()*2);
       	
       	for (e = 0; e < numberOfEnemies; e++)
       	{
       	    
       	    var enemy = new Enemy(
           	    {
                    acceleration:this._acceleration,
                    originPoint:false,
                    parent:this,
                    originX:(32 * (Math.random()*(this._middleTiles/2))),
                    originY:-48,
           	    }
       	    );
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