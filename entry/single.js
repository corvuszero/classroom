jsio('import shared.FloorManager as FloorManager');
jsio('import shared.Missile as Missile');
jsio('import timestep.Sprite');
jsio('import timestep.View');
jsio('import timestep.ImageView');
jsio('import shared.ParallaxBackground as ParallaxBackground');
jsio('import timestep.SoundManager as SoundManager');
jsio('import shared.GameConfig as GameConfig');

var app = new GCApp();
var keyListener = app.getKeyListener();
var gameConfig = GameConfig.get();
var mainView = app.getView();

app._opts.showFPS = gameConfig._showFPS;

var floorManager;
var missiles         = [];
var currentAnimation = "";

var gravity 		= gameConfig._gravity;
var acceleration 	= gameConfig._acceleration;
var life = gameConfig._life;
var hearts = [];

var hit			= false;
var hitCounter	= 0;
var hitJump     = false;
var hits        = 0;

var cameraShake   = 0;
var cameraShakeMagnitude = gameConfig._cameraShakeMagnitude;

var pause = false;
var gameOver = false;
var gameOverImage;

var currentPlatform = false;

var scoreView = new timestep.View
({
        x:0,
        y:0,
        width: gameConfig._deviceWidth / 2,
        height:gameConfig._deviceHeight / 4,
        parent:mainView
});

scoreView.render = function(ctx)
{
    if (ctx)
    {
        ctx.font        = gameConfig._largeFontSize + gameConfig._gameFont;
        ctx.fillStyle   = gameConfig._textColor;
        ctx.fillText(runner.distanceScore+" m", gameConfig._scoreX, gameConfig._scoreY);
        ctx.font        = gameConfig._smallFontSize + gameConfig._gameFont;
        ctx.fillStyle   = gameConfig._textColor;
        ctx.fillText(runner.killingScore+" kills!", gameConfig._killsX, gameConfig._killsY);
    }
}


function resetLife()
{

}

resetLife();

var runnerView = new timestep.View
({
  x:0,
  y:0,
  width:gameConfig._deviceWidth,
  height:gameConfig._deviceHeight,
  parent:mainView
});
runnerView.score = 0;

var backgroundView = new timestep.ImageView
({
	image: "images/background_sky.png",
	width: gameConfig._deviceWidth,
	height: gameConfig._deviceHeight,
	parent: mainView,
	zIndex:-3
});

var backgroundClouds = new ParallaxBackground({
	image: "images/background_clouds.png",
	y:170,
	width: gameConfig._deviceWidth,
	height: Math.round((382 * gameConfig._deviceHeight) / 600),
	parent: backgroundView,
	zIndex:-2
});

var backgroundMountains = new ParallaxBackground({
	image: "images/background_mountains.png",
	y:100,
	width: gameConfig._deviceWidth,
	height: Math.round((346 * gameConfig._deviceHeight) / 600),
	parent: backgroundView,
	zIndex:-1
});

var runner = new timestep.Sprite
({
  x:gameConfig._defaultRunnerPosition,
  y:gameConfig._defaultRunnerPosition,
  width:64 * gameConfig._spriteScale,
  height:64 * gameConfig._spriteScale,
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
    },
    hit:
    {
      width:32,
      height:32,
      imageURL: 'images/player_jumping.png',
      frameRate:4,
      frames:
      [               
	[0, 0]                      
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
runner.isShooting       = false;
runner.jumpHeight       = 0;
runner.distanceScore    = 0;
runner.killingScore     = 0;

runner.jump = function()
{
    if ( (!this.isJumping && !this.isFalling) ||  hitJump)
    {
        gravity 	= 0;
        this.isFalling  = false;
        this.isJumping  = true;
        this.stopAnimation();
        currentAnimation = 'jump';
        this.startAnimation(currentAnimation, { iterations: 5 });
        hitJump = false;
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

    if ( !runner.isShooting )
    {
        runner.stopAnimation();
        currentAnimation = 'shoot';
        runner.startAnimation(currentAnimation, { iterations:1 });
        
        var missile = new Missile
        ({
            acceleration:gameConfig._missileAcceleration,
            width: 38 * gameConfig._spriteScale,
            height:38 * gameConfig._spriteScale,
            screenWidth:gameConfig._deviceWidth,
            originX:runner.style.x + (runner.style.width/2),
            originY:runner.style.y + (runner.style.height/2),
            parent:mainView
        });
        
        missile._runner                 = runner;         
        missile._fired                  = true;
        
        runner.isShooting               = true;
        runner.shootingTimeoutHandler   = setTimeout("unlockShooting()", 600); 
        
        missiles.push(missile);
        
        // CAMERASHAKE
        // MILKSHAKE
        cameraShake = 1;
        
        SoundManager.play({
        	src: 'sounds/uzi.mp3',
        	loop:false,
        	volume:0.8
        });
    }
};

unlockShooting = function()
{
    runner.isShooting = false;
}

floorManager = FloorManager.get
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
        if (runner.isFalling && !runner.isJumping && gravity < 20)   gravity += 2;
        
        //Check for platform Collission
        if(!runner.isJumping)
        {
            for (var i in platforms)
            {
                var floor = platforms[i];
                
                if(runner.style.x + runner.style.width - 5 >= floor.style.x && runner.style.x + runner.style.width/2 < floor.style.x+floor.style.width)
                {
                    currentPlatform = floor;
                    
                    if(runner.style.y + runner.style.height < floor.style.y + 11 && runner.style.y + runner.style.height > floor.style.y -11)
                    {
                        runner.style.y   = floor.style.y - runner.style.height + 3;
                        runner.isFalling = false;
                        colliding        = true;
                    }
                    else 	
                    {
                        runner.isFalling = true;
                    }
	  
                    var enemies      = floor.getEnemies();
                    var obstacles    = floor.getObstacles();
                    
                    if(!hit)
                    {
                        if (runner.style.x < 100) runner.style.x += 1;
                        
                        for(var i in enemies)
                        {
                            var enemy = enemies[i].getPosition(mainView);
                            if(colliding)
                            {
                                if(runner.style.x + runner.style.width - 5 > enemy.x + 5 && runner.style.x + 5 < enemy.x + enemy.width - 5 )
                                {
                                    if ( !enemies[i].deleteEnemy )
                                    {
                                        hit = true;
                                        hitCounter = 30;
                                        hits++;
                                        //runner.style.x -= hitCounter;
                                        runner.stopAnimation();
                                        currentAnimation = 'hit';
                                        runner.startAnimation(currentAnimation, { iterations: 3 });
                                        floorManager.decreaseAcceleration();
                                        logger.log("Hit A!!");
                                    }
                                }
                                else
                                {
                                    if(currentAnimation != 'run')
                                    {
                                        currentAnimation = 'run';
                                        runner.startAnimation(currentAnimation);
                                    }
                                }
                                break;
                            }
                            else
                            {
                                if(runner.style.x + runner.style.width-5 > enemy.x + 5 && runner.style.x + 5 < enemy.x + enemy.width - 5 )
                                {
                                    if(runner.style.y + runner.style.height >= enemy.y && runner.style.y + runner.style.height < enemy.y + enemy.width/2)
                                    {
                                        //enemy dies!
                                        enemies[i].destroy();
                                        enemies.splice(i, 1);
                                        runner.killingScore += 1;
                                        hitJump = true;
                                        gravity = -10;
                                    }
                                    else if(runner.style.y + runner.style.height >= enemy.y + enemy.width/2 && runner.style.y + runner.style.height < enemy.y + enemy.width)
                                    {
                                        //hit!
                                        hit = true;
                                        hitCounter = 30;
                                        hits++;
                                        //runner.style.x -= hitCounter;
                                        runner.stopAnimation();
                                        currentAnimation = 'hit';
                                        runner.startAnimation(currentAnimation, { iterations: 3 });
                                        floorManager.decreaseAcceleration();
                                        logger.log("Hit B!!");
                                    }
                                }
                            }
                        }
                        
                        for(var o in obstacles)
                        {
                            var obstacle = obstacles[o].getPosition(mainView);
                            if(runner.style.x + runner.style.width - 5 > obstacle.x + 5 && runner.style.x + 5 < obstacle.x + obstacle.width - 5 )
                            {
                                if(runner.style.y + runner.style.height - 5 > obstacle.y + 5 && runner.style.y + 5 < obstacle.y + obstacle.height - 5 )
                                {
                                    hit = true;
                                    hitCounter = 30;
                                    hits++;
                                    //runner.style.x -= hitCounter;
                                    runner.stopAnimation();
                                    currentAnimation = 'hit';
                                    runner.startAnimation(currentAnimation, { iterations: 3 });
                                    floorManager.decreaseAcceleration();
                                }
                            }
                            else
                            {
                                if(currentAnimation != 'run')
                                {
                                    currentAnimation = 'run';
                                    runner.startAnimation(currentAnimation);
                                }
                            }
                        }
                        
                        break;
                    }
                    else if (hitCounter > 0) 
                    {
                        hitCounter--;
                        if(currentAnimation != "hit")
                        {
                            runner.stopAnimation();
                            currentAnimation = 'hit';
                            runner.startAnimation(currentAnimation, { iterations: 3 });
                        }
                    }
                    else
                    {
                        hitCounter = 0;
                        hit = false;
                        currentAnimation = 'run';
                        runner.startAnimation(currentAnimation);
                    }
                }
            }
        }
        //Jump or Fall
        
        for (var i in platforms)
        {
            var floor = platforms[i];
            var heart = floor.getHeart();
            if(heart != false)
            {
                var heartPosition = heart.getPosition(mainView);
                if((runner.style.x + runner.style.width - 5 >= heartPosition.x + 5) && (runner.style.x + 5 < heartPosition.x + heartPosition.width - 5))
                {
                    if((runner.style.y + runner.style.height - 5 >= heartPosition.y + 5) && (runner.style.y + 5 < heartPosition.y + heartPosition.height - 5))
                    {
                        hearts.push(new timestep.ImageView
                            ({
                              x:gameConfig._deviceWidth - ((hearts.length+1) * 32 * gameConfig._spriteScale) - ((hearts.length+1)*5),
                              y:10,
                              width:32 * gameConfig._spriteScale,
                              height: 28 * gameConfig._spriteScale,
                              originPoint:false,
                              image:'images/heart.png',
                              parent:mainView,
                              zIndex:0
                            })                            
                        );
                        life++;
                        heart.removeFromSuperview();
                        heart = false;
                    }
                }
            }
            
            var item = floor.getItem();
            
            if(item)
            {
                var itemPosition = item.getPosition(mainView);
                if((runner.style.x + runner.style.width - 5 >= itemPosition.x + 5) && (runner.style.x + 5 < itemPosition.x + itemPosition.width - 5))
                {
                    if((runner.style.y + runner.style.height - 5 >= itemPosition.y + 5) && (runner.style.y + 5 < itemPosition.y + itemPosition.height - 5))
                    {
                        item.executeItemLogic();
                        item.removeFromSuperview();
                        item = null;
                    }
                }
            }
        }
        //Uncomment next line so yoshi can't fly while falling
        //runner.isFalling  = !colliding;
        runner.style.y   += (colliding) ? 0:(gravity); 
    }
   
    
    for (var m in missiles)
    {
        var missile = missiles[m];
        missile._pause = false;
        if(missile != undefined && missile._erase)
        {
            missiles.splice(m, 1);        
            missile.removeFromSuperview();
        }
    }  
    
    //Game Over
    if(runner.style.y >= gameConfig._deviceHeight && !gameOver)
    {
        setGameOver();
    }
  
};

mainView.onInputStart = function(evt, pt)
{
    if(gameConfig._isIOS && !gameOver && !pause)
    {
      if(pt.x <= (gameConfig._deviceWidth / 2))
      {
          runner.jump();
      }
      else
      {
          runner.shoot();
      }
    }
}

mainView.onInputSelect = function(evt, pt)
{
    if(gameConfig._isIOS && !gameOver && !pause)
    {
      if(pt.x <= (gameConfig._deviceWidth / 2))
      {        
        runner.stopJump();
      }
    }
    
    if(gameOver)
    {
        gameOverImage.removeFromSuperview();
        startGame();
    }
}

function setPause(value)
{
    pause = value;    
    if (pause)
        runner.pauseAnimation();
    else 
        runner.startAnimation(currentAnimation);
    
    floorManager.setPause(pause);
    
    for (var m in missiles)
    {
        var missile = missiles[m];
        missile._pause = true;
    }
    
    var platforms = floorManager.getPlatforms();
    for (var i in platforms)
    {
        var floor = platforms[i];
        var enemies = floor.getEnemies();
        for (var e in enemies)
        {
            enemies[e]._pause = value;
            if ( enemies[e]._pause )
            {
                enemies[e].enemy.pauseAnimation();
            }
            else
            {
                enemies[e].enemy.startAnimation('rest');
            }
        }
    }
}

function setGameOver()
{
  gameOver = true;
  setPause(true);
  resetLife();

  //Reset player position so we don't infinitely add more players
  //when gameOverScreen is clicked
  runner.style.y = gameConfig._defaultRunnerPosition;
  
  gameOverImage = new timestep.ImageView
  ({
    	image: "images/gameOverScreen.png",
    	width: gameConfig._deviceWidth,
    	height: gameConfig._deviceHeight,
    	parent: mainView,
    	zIndex:5
  });
  
  var gameOverScoreView = new timestep.View
  ({
    x:Math.round((190 * gameConfig._deviceWidth) / 800),
    y:Math.round((85 * gameConfig._deviceHeight) / 600),
    width:400 * gameConfig._spriteScale,
    height:75 * gameConfig._spriteScale,
    parent:gameOverImage
  });
  
  gameOverScoreView.render = function(ctx)
  {
      if (ctx)
      {
          ctx.font        = gameConfig._xlFontSize + gameConfig._gameFont;
          ctx.fillStyle   = gameConfig._textColor;
          ctx.fillText(runner.distanceScore+" m", Math.round((30 * gameConfig._deviceWidth) / 800), 30);

          ctx.font        = gameConfig._largeFontSize + gameConfig._gameFont;
          ctx.fillStyle   = gameConfig._textColor;
          ctx.fillText(runner.killingScore + "", Math.round((400 * gameConfig._deviceWidth) / 800), 40);
      }
  }
}

function startGame()
{
    gameOver = false;

    currentAnimation = 'run';
    runner.distanceScore = 0;
    runner.killingScore = 0;
    
    setPause(!pause);
    floorManager.restart();    
}

//Init sound
//SoundManager.play({
//	src: 'sounds/bgmusic.mp3',
//	loop:true,
//	volume:0.4
//});