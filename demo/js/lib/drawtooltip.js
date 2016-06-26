Graph.prototype.drawTooltip = function(closest){
  //Draw tooltip
  var ctx = this.canvas.getContext("2d");
  if(closest.index == undefined){
    closest.index = 0;
  }
  var toolTipText = "X:"+this.dataset[closest.index].x+" Y:"+this.dataset[closest.index].y;
  ctx.font = "15px Arial";
  var toolTip = ctx.measureText(toolTipText).width +15;
  //console.log(toolTip);
  var displacement = 20*this.ratio;
  if(this.position.x > closest.x){
    displacement = -(20 + toolTip)*this.ratio;
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
  ctx.rect(this.tooltip.x, this.tooltip.y, toolTip*this.ratio, 20*this.ratio);
  ctx.fillStyle = "#cccccc";
  ctx.shadowColor = '#999';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.fill();
  ctx.restore();


  //Draw up the text for the tooltip.
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#000";
  ctx.font = "15px Arial";
  ctx.fillText(toolTipText,this.tooltip.x+5,this.tooltip.y+15);
  ctx.fill();
  ctx.restore();
}
