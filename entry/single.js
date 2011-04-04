jsio('import shared.FloorManager as FloorManager');
jsio('import shared.Missile as Missile');
jsio('import timestep.Sprite');
jsio('import timestep.View');
jsio('import timestep.ImageView');

var app = new GCApp();
var keyListener = app.getKeyListener();
var mainView = app.getView();

var floorManager;

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
        ctx.font        = "20px Times New Roman";
        ctx.fillStyle   = "Yellow";
        ctx.fillText(runner.score, 5, 30);
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

var backgroundClouds = new timestep.ImageView
({
	image: "images/background_clouds.png",
	y:150,
	width: 800,
	height: 382,
	parent: backgroundView,
	zIndex:-2
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

currentAnimation = 'run';
runner.startAnimation(currentAnimation);
runner.isFalling = false;
runner.isJumping = false;
runner.jumpHeight = 0;
runner.score = 0;

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
    runner.score += 5;
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
    missile.fired = true;
};

backgroundView.render = function(ctx)
{
	ctx.fillStyle = 'rgb(0, 151, 192)';
	ctx.fillRect(0, 0, backgroundView.style.width, backgroundView.style.height);
}

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
      logger.log("pause es " + pause);
      if(pause) runner.pauseAnimation();
      else runner.startAnimation(currentAnimation);
      floorManager.setPause(pause);
    }
  }
      
      if(!pause)
      {
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
  	else continue;
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
      runner.isFalling 	= !colliding;
      speedY          	= (colliding) ? 0:(speedY+gravity);
      runner.style.y	+= speedY; 
      
      scoreView.render();
  }
};