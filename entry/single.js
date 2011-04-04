jsio('import shared.FloorManager as FloorManager');
jsio('import shared.Missile as Missile');
jsio('import timestep.Sprite');
jsio('import timestep.View');
jsio('import timestep.ImageView');
jsio('import shared.ParallaxBackground as ParallaxBackground');

var app = new GCApp();
var keyListener = app.getKeyListener();
app._opts.showFPS = true;
var mainView = app.getView();

var floorManager;
var missiles = [];
var currentAnimation = "";

var speed   = 3;
var speedX  = 0.5;
var speedY  = 0;
var gravity = 0.5;
var jumpAcc = 0;
var acceleration = 4;

var pause = false;


var scoreView = new timestep.View
({
        x:10,
        y:10,
        width:400,
        height:75,
        parent:mainView
});

scoreView.render = function(ctx)
{
    if (ctx)
    {
        ctx.font        = "3em Arial Black";
        ctx.fillStyle   = "Yellow";
        ctx.fillText(runner.distanceScore+" m", 30, 30);
        ctx.font        = "2em Arial Black";
        ctx.fillStyle   = "Yellow";
        ctx.fillText(runner.killingScore+" kills", 30, 60);
    }
}

var runnerView = new timestep.View
({
  x:0,
  y:0,
  width:800,
  height:600,
  parent:mainView
});
runnerView.score = 0;

var backgroundView = new timestep.ImageView
({
	image: "images/background_sky.png",
	width: 800,
	height: 600,
	parent: mainView,
	zIndex:-3
});

var backgroundClouds = new ParallaxBackground({
	image: "images/background_clouds.png",
	y:170,
	width: 800,
	height: 382,
	parent: backgroundView,
	zIndex:-2
});

var backgroundMountains = new ParallaxBackground({
	image: "images/background_mountains.png",
	y:100,
	width: 800,
	height: 346,
	parent: backgroundView,
	zIndex:-1
});

var runner = new timestep.Sprite
({
  x:100,
  y:100,
  width:64,
  height:64,
  animations:
  {
    run:
    {
      width:32,
      height:32,
      imageURL: 'images/player_running.png',
      frameRate:16,
      frames:
      [
      [0,0],
      [31,0],
      [62,0],
      [93,0],
      [124,0],
      [155,0],
      [186,0],
      [217,0],
      [248,0],
      [279,0],
      [310,0],
      [341,0]                                            
      ]
    },
    shoot:
    {
      width:32,
      height:32,
      imageURL: 'images/player_shooting.png',
      frameRate:16,
      frames:
      [
        [31, 0],               
        [62, 0]
      ]
    },
    jump:
    {
        width:32,
        height:32,
        imageURL: 'images/player_jumping.png',
        frameRate:16,
        frames:
        [               
          [0, 0],
          [32, 0],
          [64, 0],
          [32, 0]                        
        ]
    }
  },
  defaultAnimation:'run',
  parent:runnerView,
  zIndex: 1
});

currentAnimation = 'run';
runner.startAnimation(currentAnimation);
runner.isFalling        = false;
runner.isJumping        = false;
runner.jumpHeight       = 0;
runner.distanceScore    = 0;
runner.killingScore     = 0;

runner.jump = function()
{
    if ( !this.isJumping && !this.isFalling )
    {
        this.isFalling  = false;
        this.isJumping  = true;
        jumpAcc         = 0;
        this.stopAnimation();
        currentAnimation = 'jump';
        this.startAnimation(currentAnimation, { iterations: 5 });
    }
};

runner.stopJump = function()
{
    this.isJumping = false;
    this.isFalling = true;
    this.stopAnimation();
    currentAnimation = 'run';
    this.startAnimation(currentAnimation);
};

runner.jumpFinished = function()
{
    this.stopAnimation();
    currentAnimation = 'run';
    this.startAnimation(currentAnimation);
};

runner.shoot = function()
{
    runner.stopAnimation();
    currentAnimation = 'shoot';
    runner.startAnimation(currentAnimation, { iterations:1 });
    runner.killingScore += 1;
    
    var missile = new Missile
        ({
          acceleration:20,
          originPoint:false,
          width: 30,
          height:30,
          originX:runner.style.x + (runner.style.width/2),
          originY:runner.style.y + (runner.style.height/2),
          parent:mainView
        });
    missile._fired = true;
    missiles.push(missile);
};

floorManager = new FloorManager
({
  acceleration:acceleration,
  speed:(this.speed*=2),
  platformParent:runnerView
});



mainView.tick = function(dt)
{


  //Runner Logic
  var events = keyListener.popEvents();
  for (var i = 0; i < events.length; i++)
  {
    var event = events[i];
    if(!pause)
    {
      // SHOOTING
      if (event.code == keyListener.SPACE && event.lifted)
      {
        runner.shoot();
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
    
    //Pause
    if(event.code == 80 && !event.lifted)
    {
        pause = !pause;
        if (pause) runner.pauseAnimation();
        else runner.startAnimation(currentAnimation);
        floorManager.setPause(pause);
        for (var m in missiles)
        {
            var missile = missiles[m];
            missile._pause = true;
        }
    }
  }
      
      if(!pause)
      {
      runner.distanceScore += 1;

      //Update ParallaxScroll
      backgroundMountains.update(runner.distanceScore);
      backgroundClouds.update(runner.distanceScore);    
        
      //Platform generation
      floorManager.checkFloors();
  
      //Platform Collision
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
            else 
            {
                continue;
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
      
        //
        runner.isFalling 	 = !colliding;
        speedY               = (colliding) ? 0:(speedY+gravity);
        runner.style.y      += speedY; 
        for (var m in missiles)
        {
            var missile = missiles[m];
            missile._pause = false;
            if(missile != undefined && missile._erase)
           	{
             	missile.removeFromSuperview();
             	missiles.splice(m, 1);
           	}
        }
      
  }
};