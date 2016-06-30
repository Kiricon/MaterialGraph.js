# Material Graph
> A super lightweight pure javascript plug in for easily making html5 graphs that look great!

## Installation

The files need for installation are located at /dist

## Use
To use material graph simply import the MaterialGraph.min.js file in to your project and then create a new instance of the Graph class. The graph class takes two variables on instantiation . A string for the element you want to reference and a dataset.
```javascript
var dataset = [
    {x: 0, y:0},
    {x: 2, y:3},
    {x: 7, y: 5}
    ];
var graph = new Graph('#canvas', dataset); //Get the graph ready
var graph.init(); // Draw the graph
```

## License

MIT © [Dominic Valenciana](https://valenciana.me)
