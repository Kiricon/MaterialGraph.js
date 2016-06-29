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

  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#000";
  ctx.font = "12px Arial";
  ctx.fillText("X", (padding/4), this.canvas.height-(padding/2)+3);
  ctx.fillText("Y", (padding/2)-5, this.canvas.height-(padding/4)+5);
  ctx.fill();
  ctx.restore();


}
