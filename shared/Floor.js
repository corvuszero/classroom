jsio('import timestep.View');
jsio('import timestep.ImageView');
jsio('import shared.Enemy as Enemy');


var Floor = exports = Class(timestep.View, function(supr) 
{
	
	this.init = function(opts) 
	{
        this._enemies = [];
        
		opts = opts || {};
		supr(this, 'init', [opts]);
		this._pause = false;
		
		if (typeof opts.originPoint != 'boolean') { opts.originPoint = false; }
		if (typeof opts.acceleration != 'number') { opts.acceleration = 4; }
      
        this._screenWidth = opts.screenWidth;
        this._screenHeight = opts.screenHeight;
        this._spriteScale = opts.spriteScale;

        this._spawnNewPlatform = false;
        if(!opts.originPoint) 
            this._middleTiles = 10 + Math.round(Math.random() * 25);
        else 
            this._middleTiles = 30;
            
        this._defaultRows = 3;
        this._extraRows = Math.round(Math.random() * 10);
        
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
       	       	
       	if(!this._originPoint)
       	{
           	var numberOfEnemies = Math.floor(Math.random()*2);
           	
           	for (e = 0; e < numberOfEnemies; e++)
           	{
           	    var enemy = new Enemy(
               	    {
                        acceleration:this._acceleration,
                        spriteScale:this._spriteScale,
                        originPoint:false,
                        parent:this,
                        originX:(32 * this._spriteScale * Math.floor( ( Math.random() * (1) * (this._middleTiles/5) ) ) ),
                        originY:-48 * this._spriteScale,
               	    }
           	    );
           	    this._enemies.push(enemy);
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