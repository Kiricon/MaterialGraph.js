Graph.prototype.draw = function(e) {
    var canvas = this.canvas
    var ctx = canvas.getContext("2d");
    var point = "";
    var i = 0;
    var divisible = this.realWidth / this.points.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Simple stuff to fill out our canvas
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFF";



    ctx.beginPath();
    ctx.save();
    var self = this;
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for(var i =0; i < this.points.length; i++){
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.strokeStyle = '#00C853';
    ctx.lineWidth = 2 * this.ratio;
    ctx.stroke();
    ctx.restore();

    if(this.position.x){
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.position.x, 0);
      ctx.lineTo(this.position.x, canvas.height);
      ctx.strokeStyle = "#777777";
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      var closest = closest(this.position.x, this.points);
      ctx.arc(closest.x, closest.y, 5, 0, 2 * Math.PI, false);
      ctx.fillStyle = "#00C853";
      ctx.fill();
    }

    function closest(num, arr) {
                    var curr = arr[0];
                    var diff = Math.abs (num - curr.x);
                    for (var val = 0; val < arr.length; val++) {
                        var newdiff = Math.abs (num - arr[val].x);
                        if (newdiff < diff) {
                            diff = newdiff;
                            curr = arr[val];
                        }
                    }
                    return curr;
                }
};
