Graph.prototype.drawAxis = function(){
  ctx = this.canvas.getContext('2d');
  var padding = this.canvas.width /10;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(padding/2, this.canvas.height-(padding/2));
  ctx.lineTo(this.canvas.width, this.canvas.height-(padding/2));
  ctx.moveTo(padding/2, 0);
  ctx.lineTo(padding/2, this.canvas.height-(padding/2));
  ctx.strokeStyle = "#777777";
  ctx.stroke();
  ctx.restore();

}
