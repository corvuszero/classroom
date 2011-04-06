jsio('import shared.Floor as Floor');
jsio('import shared.Missile as Missile');
jsio('import timestep.Sprite');
jsio('import timestep.SoundManager as SoundManager');

var Runner = exports = Class(timestep.Sprite, function(supr)
{

    var isFalling;
    var isJumping;
    var jumpHeight;
    var distanceScore;
    var killingScore;
    
    var mainView;
    var floorManager;

    var missiles;

    this.init = function(opts, mainView, floorManager) 
    {
        opts = opts || {};
        this.mainView = [];
        this.missiles = [];
        supr(this, 'init', [opts]);
        
        this.mainView       = mainView;
        this.floorManager   = floorManager;
        
        this.isFalling      = true;
        this.isJumping      = false;
        this.jumpHeight     = 0;
        this.distanceScore  = 0;
        this.killingScore   = 0;
        
    }
    
    this.jump = function()
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
    
    this.stopJump = function()
    {
        this.isFalling 	= true;
        this.isJumping	= false;
        this.stopAnimation();
        currentAnimation = 'run';
        this.startAnimation(currentAnimation);
    };
    
    this.shoot = function()
    {
        this.stopAnimation();
        currentAnimation = 'shoot';
        this.startAnimation(currentAnimation, { iterations:1 });
        this.killingScore += 1;
        
        var missile = new Missile
            ({
              acceleration:20,
              width: 38,
              height:38,
              originX:this.style.x + (this.style.width/2),
              originY:this.style.y + (this.style.height/2),
              parent:mainView
            });
        missile._floorManager   = floorManager;
        missile._fired          = true;
        this.missiles.push(missile);
        
        SoundManager.play({
        	src: 'sounds/uzi.mp3',
        	loop:false,
        	volume:0.8
        });
    };
	
});