Graph.prototype.drawTooltip = function(closest){
  //Draw tooltip
  var ctx = this.canvas.getContext("2d");
  var toolTipText = "X:"+this.dataset[closest.index].x+" Y:"+this.dataset[closest.index].y;
  var toolTipWidth = ctx.measureText(toolTipText).width*2;
  var displacement = 20*this.ratio;
  if(this.position.x > closest.x){
    displacement = -(20 + toolTipWidth)*this.ratio;
  }
  var rest = {x: closest.x+displacement, y: closest.y-10};
  var dif = {x: Math.abs(this.tooltip.x - rest.x)/15, y: Math.abs(this.tooltip.y - rest.y)/15};
  if(this.tooltip.x != rest.x ){
    if(rest.x > this.tooltip.x){
      this.tooltip.x += dif.x;
    }else{
      this.tooltip.x -= dif.x;
    }
  }

  if(this.tooltip.y != rest.y ){
    if(rest.y > this.tooltip.y){
      this.tooltip.y += dif.y;
    }else{
      this.tooltip.y -= dif.y;
    }
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(this.tooltip.x, this.tooltip.y, toolTipWidth*this.ratio, 20*this.ratio);
  ctx.fillStyle = "#cccccc";
  ctx.shadowColor = '#999';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 10;
  ctx.shadowOffsetY = 10;
  ctx.fill();
  ctx.restore();


  //Draw up the text for the tooltip. 
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#000";
  ctx.font = "30px Arial";
  ctx.fillText(toolTipText,this.tooltip.x+15,this.tooltip.y+30);
  ctx.fill();
  ctx.restore();
}
