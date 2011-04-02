jsio('import timestep.View');
jsio('import timestep.ImageView');

var ParallaxBackground = exports = Class(timestep.View, function(supr) 
{

      this.init = function(opts) 
      {
    		opts = opts || {};
    		supr(this, 'init', [opts]);

    		//double the size
    		this.style.width = opts.width*2;
    		
    		//Generate both imageviews
    		var buffer1 = new timestep.ImageView
        ({
        	image: opts.image,
        	width: opts.width,
        	height: opts.height,
        	parent: this,
        	zIndex: opts.zIndex
        });

    		var buffer2 = new timestep.ImageView
        ({
        	image: opts.image,
        	x:opts.width,
        	width: opts.width,
        	height: opts.height,
        	parent: this,
        	zIndex: opts.zIndex
        });    		
      }

      this.render = function(ctx) 
      {
    		ctx = ctx || {};
    		supr(this, 'render', [ctx]);
    		
      }

      this.tick = function(dt) 
      {


      }
      
      this.update = function(scroll)
      {        
        if(this.style.x <= -this.style.width/2) this.style.x = 0;
        else this.style.x += 1/this.style.zIndex;        
      }

  }
);