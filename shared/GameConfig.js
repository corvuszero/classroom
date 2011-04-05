jsio('import timestep.device');

var GameConfig = exports = Class(function()
{
    this.init = function()
    {
        //Device
        this._deviceWidth = timestep.device.width;
        this._deviceHeight = timestep.device.height;
        
        //Text
        this._smallFontSize = this._deviceWidth > 500 ? 2:1;
        this._largeFontSize = this._deviceWidth > 500 ? 3:2;
        this._xlFontSize    = this._deviceWidth > 500 ? 4:3; 
        
        //Score Position
        this._scoreX = 10;
        this._scoreY = this._largeFontSize * 10;
        this._killsX = this._scoreX;
        this._killsY = this._scoreY + (this._largeFontSize * 10);
        
        //Control
        this._gravity = 10;
        this._acceleration = 8;
        this._life = 3;
        this._spriteScale = this._deviceWidth > 500? 1:0.5;
        
        this._cameraShakeMagnitude = 5;
    }
});