jsio('import shared.GameConfig as GameConfig');
jsio('import shared.FloorManager as FloorManager');
jsio('import timestep.View');
jsio('import timestep.Sprite');

var Booster = exports = Class(timestep.View, function(supr)
{
    this.init = function(opts)
    {
		opts = opts || {};
        supr(this, 'init', [opts]);
        this._gameConfig = GameConfig.get();
        this._floorManager = FloorManager.get();
		
		this.style.width = 32 * (this._gameConfig)._spriteScale;
		this.style.height = 30 * (this._gameConfig)._spriteScale;
		this.style.x = opts.x - 16 * (this._gameConfig)._spriteScale;
		this.style.y = opts.y * (this._gameConfig)._spriteScale;
		
		this.drawItem();
    }
    
    this.drawItem = function()
    {
       var booster = new timestep.Sprite
       ({
          x:0,
          y:0,
          width:32 * (this._gameConfig)._spriteScale,
          height:30 * (this._gameConfig)._spriteScale,
          animations :
          {
              idle:
              {
                width:16,
                height:15,
                imageURL: 'images/boosterRed.png',
                frameRate:8,
                frames:
                [
                    [0,0],
                    [16,0],
                    [32,0],
                    [48,0]
                ]
              }
          },
          defaultAnimation:'idle',
          parent:this
       });
       
       booster.startAnimation('idle');
    }

    this.executeItemLogic = function()
    {
        var accelerationModifier = {};
        accelerationModifier.property = "acceleration";
        accelerationModifier.previousAcceleration = this._floorManager._acceleration;
        accelerationModifier.magnitude = 1;
        accelerationModifier.peakAcceleration = this._gameConfig._acceleration * 20;
        accelerationModifier.accelerationInterval = 0.5;
        
        this._floorManager._accelerationModifier = accelerationModifier;
    }    
});
