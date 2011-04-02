jsio('import shared.FloorManager as FloorManager');

var app = new GCApp();
var keyListener = app.getKeyListener();
var mainView = app.getView();

var speed = 3;
var friction = 2;
var floorManager;

jsio('import timestep.View');
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

jsio('import timestep.Sprite');
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
        [64, 0],
        [128, 0],
        [192, 0]
      ]
    },
    shoot:
    {
      width:64,
      height:108,
      imageURL: 'images/player.png',
      frameRate:1,
      frames:
      [[128, 0]]
    }
  },
  defaultAnimation:'run',
  parent:runnerView,
  zIndex: 1
});

backgroundView.render = function(ctx)
{
	ctx.fillStyle = 'rgb(185,211,238)';
	ctx.fillRect(0, 0, backgroundView.style.width, backgroundView.style.height);
}

backgroundView.tick = function()
{
  floorManager.checkFloors();
}

runner.startAnimation('run');
floorManager = new FloorManager
({
  acceleration:this.acceleration,
  speed:this.speed,
  platformParent:runnerView,
});