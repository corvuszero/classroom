jsio('import shared.FloorManager as FloorManager');
jsio('import timestep.Sprite');
jsio('import timestep.View');

var app = new GCApp();
var keyListener = app.getKeyListener();
var mainView = app.getView();

var floorManager;

var speed = 3;
var speedX = 0.5;
var speedY = 0;
var gravity = 0.5;

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
  x:20,
  y:10,
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

runner.jump = function()
{
    if ( !this.isJumping && !this.isFalling)
    {
        this.isJumping = true;
        this.stopAnimation();
        this.startAnimation('jump', { iterations: 5, callback: this.jumpFinished } );
    }
}

runner.jumpFinished = function()
{
    runner.isJumping = false;
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
  acceleration:this.acceleration,
  speed:this.speed,
  platformParent:runnerView
});

runnerView.tick = function(dt) 
{
	var events = keyListener.popEvents();
	for (var i = 0; i < events.length; i++) 
	{
		var event = events[i];
		
		// SHOOTING
		if (event.code == keyListener.SPACE && event.lifted) 
		{
			runner.startAnimation('shoot', { iterations:1 });
		}
		// JUMPING
		else if (event.code == keyListener.UP && event.lifted)
		{
		  runner.jump();
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
        if(runner.style.x >= floor.style.x && runner.style.x < (floor.style.x+floor.style.width))
        {
            if (runner.style.y + runner.style.height + 5 < floor.style.y)
            {
                colliding = false;
                runner.isFalling = true;
            }
            else
            { 
                colliding = true;
                runner.isFalling = false;
            }
        }
    }
    
    if ( runner.isJumping )
    {
        runner.style.y -= 10;
    }
    
    speedX        += 0.5;
    speedY        = (colliding) ? 0:(speedY+gravity);
    runner.style.x += 1;
    runner.style.y += speedY;
    
};