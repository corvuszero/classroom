jsio('import shared.FloorManager as FloorManager');
jsio('import shared.Missile as Missile');
jsio('import timestep.Sprite');
jsio('import timestep.View');
jsio('import timestep.ImageView');
jsio('import shared.ParallaxBackground as ParallaxBackground');
jsio('import timestep.SoundManager as SoundManager');


var app = new GCApp();
var keyListener = app.getKeyListener();
app._opts.showFPS = true;
var mainView = app.getView();

var floorManager;
var missiles    = [];
var currentAnimation = "";

var gravity 		  = 10;
var acceleration 	= 8;

var cameraShake   = 0;
var cameraShakeMagnitude = 5;

var pause = false;
var gameOver = false;
var gameOverImage;

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
runner.isFalling        = true;
runner.isJumping        = false;
runner.jumpHeight       = 0;
runner.distanceScore    = 0;
runner.killingScore     = 0;

runner.jump = function()
{
    if ( !this.isJumping && !this.isFalling )
    {
	gravity 	= 0;
        this.isFalling  = false;
        this.isJumping  = true;
        this.stopAnimation();
        currentAnimation = 'jump';
        this.startAnimation(currentAnimation, { iterations: 5 });
    }
};

runner.stopJump = function()
{
    runner.isFalling 	= true;
    runner.isJumping	= false;
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
          width: 38,
          height:38,
          originX:runner.style.x + (runner.style.width/2),
          originY:runner.style.y + (runner.style.height/2),
          parent:mainView
        });
    missile._floorManager   = floorManager;
    missile._fired          = true;
    missiles.push(missile);
    
    //CAMERASHAKE
    cameraShake = 1;
    
    SoundManager.play({
    	src: 'sounds/uzi.mp3',
    	loop:false,
    	volume:0.8
    });
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
    if(!gameOver && !pause)
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
    if(!gameOver && event.code == 80 && !event.lifted)
    {
        setPause(!pause);
    }
  }
      

  if(!gameOver && !pause)
  {
    runner.distanceScore += 1;

    //CameraShake
    if(cameraShake == -1)
    {
      mainView.style.x += cameraShakeMagnitude;
      mainView.style.y += cameraShakeMagnitude;      
      cameraShake = 0;
    }
        
    if(cameraShake)
    {
      mainView.style.x -= cameraShakeMagnitude;
      mainView.style.y -= cameraShakeMagnitude;      
      cameraShake = -1;
    }
    
    //Update ParallaxScroll
    backgroundMountains.update(runner.distanceScore);
    backgroundClouds.update(runner.distanceScore);    
      
    //Platform generation
    floorManager.checkFloors();

  
    //Platform Collision
    var platforms = floorManager.getPlatforms();
    var colliding = false;
    
    //Update Runner Gravity
    if (runner.isJumping && gravity > -26 ) gravity -= 2;
    if (runner.isJumping && gravity <= -26) runner.stopJump();
    if (runner.isFalling && gravity < 20)   gravity += 2;
   
   //Check for platform Collission
    if(!runner.isJumping)
    {
      for (var i in platforms)
      {
	var floor = platforms[i];
	if(runner.style.x + runner.style.width >= floor.style.x && runner.style.x + runner.style.width/2 < (floor.style.x+floor.style.width))
	{
	  if(runner.style.y + runner.style.height < floor.style.y + 11 && runner.style.y + runner.style.height > floor.style.y -11)
	  {
	      runner.style.y   = floor.style.y - runner.style.height;
	      runner.isFalling = false;
	      colliding        = true;
	  }
	  else 	runner.isFalling = true;
	  break;
	}
      }

    }
    //Jump or Fall
    runner.style.y += (colliding) ? 0:(gravity); 
  }
   
    
  for (var m in missiles)
  {
      var missile = missiles[m];
      missile._pause = false;
      if(missile != undefined && missile._erase)
      {
	      missiles.splice(m, 1);        
	      //missile.removeFromSuperview();

      }
  }
  
  //Game Over
  if(runner.style.y >= 600 && !gameOver)
  {
    setGameOver();
  }
  
};

function setPause(value)
{
  pause = value;
  if (pause) runner.pauseAnimation();
  else runner.startAnimation(currentAnimation);
  floorManager.setPause(pause);
  for (var m in missiles)
  {
      var missile = missiles[m];
      missile._pause = true;
  }
}

function setGameOver()
{
  gameOver = true;
  setPause(true);
  gameOverImage = new timestep.ImageView
  ({
    	image: "images/gameOverScreen.png",
    	width: 800,
    	height: 600,
    	parent: mainView,
    	zIndex:5
  });
  
  var gameOverScoreView = new timestep.View
  ({
    x:190,
    y:85,
    width:400,
    height:75,
    parent:gameOverImage
  });
  
  gameOverScoreView.render = function(ctx)
  {
      if (ctx)
      {
          ctx.font        = "4em Arial Black";
          ctx.fillStyle   = "White";
          ctx.fillText(runner.distanceScore+" m", 30, 30);

          ctx.font        = "3em Arial Black";
          ctx.fillStyle   = "White";
          ctx.fillText(runner.killingScore + "", 400, 40);
      }
  }
  
  gameOverScoreView.tick = function(dt)
  {    
    var events = keyListener.popEvents();
    for (var i = 0; i < events.length; i++)
    {
      var event = events[i];    
      if (event.code == keyListener.SPACE && event.lifted)
      {
        logger.log("REINICIAR");
      }    
    }
  }
}

function startGame()
{
  
}

//Init sound
SoundManager.play({
	src: 'sounds/bgmusic.mp3',
	loop:true,
	volume:0.4
});

