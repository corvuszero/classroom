jsio('import timestep.ImageView');

var ParallaxBackground = exports = Class(timestep.ImageView, function(supr) 
{

      this.init = function(opts) 
      {
    		opts = opts || {};
    		supr(this, 'init', [opts]);
        
      }

      this.render = function(ctx) 
      {
    		ctx = ctx || {};
    		supr(this, 'render', [ctx]);
    		
      }

      this.tick = function(dt) 
      {

          if ( this.fired )
          {
              if (this.style.x + this.style.width < 800)
              {
                  this.style.x += this._acceleration;
              }
              else
              {
                  this.removeFromSuperview();
              }            
          }
      }

  }
);