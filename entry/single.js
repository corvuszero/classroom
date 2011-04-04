jsio('import shared.FloorManager as FloorManager');
jsio('import timestep.Sprite');
jsio('import timestep.View');

var app = new GCApp();
var keyListener = app.getKeyListener();
var mainView = app.getView();

var floorManager;

var speed   = 3;
var speedX  = 0.5;
var speedY  = 0;
var gravity = 0.5;
var jumpAcc = 0;
var acceleration = 4;

var runnerView = new timestep.View
({
  x:0,
  y:0,
  width:800,
  height:600,
  parent:mainView
});

var backgroundView = new timestep.View
({
  x:0,
  y:0,
  width:800,
  height:600,
  parent:runnerView
});

var runner = new timestep.Sprite
({
  x:100,
  y:100,
  width:64,
  height:108,
  animations:
  {
    run:
    {
      width:64,
      height:108,
      imageURL: 'images/player.png',
      frameRate:8,
      frames:
      [
        [0,0],
        [192, 0]
      ]
    },
    shoot:
    {
      width:64,
      height:108,
      imageURL: 'images/player.png',
      frameRate:8,
      frames:
      [
        [64, 0],
        [128, 0]
      ]
    },
    jump:
    {
        width:64,
        height:108,
        imageURL: 'images/player.png',
        frameRate:8,
        frames:
        [
            [192, 0]
        ]
    }
  },
  defaultAnimation:'run',
  parent:runnerView,
  zIndex: 1
});

runner.startAnimation('run');
runner.isFalling = false;
runner.isJumping = false;
runner.jumpHeight = 0;

runner.jump = function()
{
    if ( !this.isJumping && !this.isFalling )
    {
        this.isFalling  = false;
        this.isJumping  = true;
        jumpAcc         = 0;
        this.stopAnimation();
        this.startAnimation('jump', { iterations: 5 });
        
    }
}

runner.stopJump = function()
{
    this.isJumping = false;
    this.isFalling = true;
    this.stopAnimation();
    this.startAnimation('run');
}

runner.jumpFinished = function()
{
    this.stopAnimation();
    this.startAnimation('run');
}

backgroundView.render = function(ctx)
{
	ctx.fillStyle = 'rgb(185,211,238)';
	ctx.fillRect(0, 0, backgroundView.style.width, backgroundView.style.height);
}

backgroundView.tick = function()
{
  floorManager.checkFloors();
}

floorManager = new FloorManager
({
  acceleration:(acceleration),
  speed:(this.speed*=2),
  platformParent:runnerView
});

runnerView.tick = function(dt) 
{
	var events = keyListener.popEvents();
	for (var i = 0; i < events.length; i++) 
	{
		var event = events[i];
		
        // SHOOTING
        if (event.code == keyListener.SPACE)
        {
        	runner.startAnimation('shoot', { iterations:1 });
        }
        // JUMPING
        else if (event.code == keyListener.UP && !event.lifted)
        {
            runner.jump();
        }
        else if (event.code == keyListener.UP && event.lifted)
        { 
            runner.stopJump();
        }
		
	}
	
	if ( runner.isJumping && jumpAcc < 1000 )
    {
        jumpAcc             += 15;
        runner.jumpHeight   += 15;
        runner.style.y      -= 15;
        
        if (runner.jumpHeight >= 300)
        {
            runner.isFalling    = true;
            runner.jumpHeight   = 0;
            runner.isJumping    = false;
        }
    }
};

mainView.tick = function(dt)
{
    var platforms = floorManager.getPlatforms();
    var colliding = false;
    var jumping   = false;
   
    for (var i in platforms)
    {
        var floor = platforms[i];
        if(runner.style.x + runner.style.width >= floor.style.x && runner.style.x < (floor.style.x+floor.style.width))
        {
            if ((runner.style.y + runner.style.height < floor.style.y - 15) || (runner.style.y + runner.style.height > floor.style.y + 15))
            {
              colliding = false;
            }
            else
            { 
              colliding = true;
	      if(!runner.isJumping)runner.style.y = floor.style.y - runner.style.height;
            }
	    break;
        }
	else continue;
    }
    
    runner.isFalling 	= !colliding;
    speedY          	= (colliding) ? 0:(speedY+gravity);
    runner.style.y	+= speedY; 
};