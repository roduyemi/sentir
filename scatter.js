plotScatter = (d3, data) => {
  let width = window.innerWidth,
     height = window.innerHeight;
  // var data    = [], min = max = 50;
  let sentiments = [];
  data.map(d => {
    sentiments.push(d.x)
  });
  let min = Math.min(parseFloat(sentiments));
  let max = Math.max(parseFloat(sentiments));
  let origin  = [480, 250], startAngle = Math.PI/8, beta = startAngle;
  let svg     = d3.select('svg').call(d3.drag().on('drag', dragged).on('start', dragStart).on('end', dragEnd)).append('g');
  svg.attr({
    width, height
  });
  let color   = d3.scaleOrdinal(d3.schemeCategory10);
  let rn      = (min, max) => { return Math.round(d3.randomUniform(min, max + 1)()); };
  let mx, my, mouseX, mouseY;

  for (var i = sentiments.length; i >= 0; i--) {
    data[i] = ({
        ...data[i],
        x: rn(-min, max),
        y: rn(-min, max),
        z: rn(-min, max)
    });
  }

  let div = d3.select('body').append('div')	
  .attr('class', 'tooltip')

  var _3d = d3._3d()
      .scale(5)
      .origin(origin)
      .rotateX(startAngle)
      .rotateY(startAngle)
      .primitiveType('POINTS');

  var data3D  = _3d(data);
  var extentZ = d3.extent(data3D, d => { return d.rotated.z });
  var zScale  = d3.scaleLinear().domain([extentZ[1]+10, extentZ[0]-10]).range([1, 8]);

  function dragStart(){
      mx = d3.event.x;
      my = d3.event.y;
  }

  function dragged(){
      mouseX = mouseX || 0;
      mouseY = mouseY || 0;
      beta   = (d3.event.x - mx + mouseX) * Math.PI / 360 * (-1);
      theta = (d3.event.y - my + mouseY) * Math.PI / 360 * (-1);
      processData(_3d.rotateX(theta + startAngle)(data));
      processData(_3d.rotateY(beta + startAngle)(data));
      
  }

  function dragEnd(){
      mouseX = d3.event.x - mx + mouseX;
      mouseY = d3.event.y - my + mouseY;
  }

  function processData(data){

      var points = svg.selectAll('circle').data(data);

      points
          .enter()
          .append('circle')
          .merge(points)
          // .attr('fill', function(d, i){ return color(i); })
          .attr('fill', (d, i) => { return getColor(d.sentiment); })
          // .attr('stroke', function(d, i){ return d3.color(color(i)).darker(0.5); })
          .sort(function(a, b){ return d3.descending(a.rotated.z, b.rotated.z); })
          .attr('cx', function(d){ return d.projected.x; })
          .attr('cy', function(d){ return d.projected.y; })
          .attr('r' , function(d){ return zScale(d.rotated.z); })
          .on('mouseover', handleMouseOver)
          .on('mouseout', handleMouseOut);

      points.exit().remove();
  }

    function handleMouseOver(d, i) {

    d3.select(this).attr({
      // fill: 'orange',
      // opacity: 0.5,
      // r: d => { return radius + d.y / 4; }
    });

    svg.append('text').attr({
      id: 't' + d.x + '-' + d.y + '-' + i,
        x: () => { return xScale(d.x) - 30; },
        y: () => { return yScale(d.y) - 15; }
    })

    div.transition()		
      .duration(200)		
      .style('opacity', .75);		
    div
      .html(d['sentiment'] + "<br/>" + d['text'])
      .style("left", (d3.event.pageX) + "px")		
      .style("top", (d3.event.pageY - 28) + "px");
  }

  function handleMouseOut(d, i) {

    d3.select(this).attr({
      fill: d => { return getColor(d.sentiment); },
      opacity: 1,
      // r: d => { return radius + d.y / 5; }
    });

    d3.select('#t' + d.x + '-' + d.y + '-' + i).remove();

    div.transition()		
    .duration(500)		
    .style('opacity', 0);  
  }

  function getColor(score) {
    if (score > 0 || score === 'positive') {
      return 'green';
    } else if (score < 0 || score === 'negative') {
      return 'red';
    } else {
      return '#ffe13d';
    }
  }

  var legend = svg.append('g')
  .style("font-family", "Lato, Helvetica Neue, Helvetica, Arial, sans-serif")
  .style("font-size", "14px")
  .style('font-weight','bold')
  .style("fill", "#2c3e50")
  .attr("text-anchor", "end")
  .selectAll("g")
  .data(['positive', 'neutral', 'negative'])
  .enter().append("g")
  .attr("transform", function(d, i) { return "translate(75," + i * 20 + ")"; });

  legend.append('rect')
  // .attr('cx', 960 - 150)
  // .attr('cy', 10)
  // .attr('r', 5)
  // // .style('fill', d => { return getColor(d) })
  // .style('fill', 'none')
  // .attr('stroke-width', 2)
  // .attr('stroke', d => { return getColor(d) })
  .attr('x', 960 - 150)
  .attr('width', 18)
  .attr('height', 18)
  .attr('fill', d => { return getColor(d) })

  legend.append('text')
  .attr('x', 960 - 170)
  .attr('y', 9.5)
  .attr('dy', '0.32em')
  .text(function(d) { return d; });

  processData(data3D);
}

// plotScatter = (d3, data) => {
//   // http://bl.ocks.org/WilliamQLiu/76ae20060e19bf42d774

//   let w = window.innerWidth,
//       h = window.innerHeight,
//       margin = { top: 40, right: 20, bottom: 20, left: 40 },
//       radius = 10;

//   let svg = d3.select("body").append("svg").attr({
//     width: w,
//     height: h
//   });
  
//   // We're passing in a function in d3.max to tell it what we're maxing (x value)
//   let xScale = d3.scale.linear()
//   .domain([0, d3.max(data, function (d) { return d.x + 10; })])
//   .range([margin.left, w - margin.right]);  // Set margins for x specific

//   // We're passing in a function in d3.max to tell it what we're maxing (y value)
//   let yScale = d3.scale.linear()
//   .domain([0, d3.max(data, function (d) { return d.y + 10; })])
//   .range([margin.top, h - margin.bottom]);  // Set margins for y specific

//   // Add a X and Y Axis (Note: orient means the direction that ticks go, not position)
//   let xAxis = d3.svg.axis().scale(xScale).orient('top');
//   let yAxis = d3.svg.axis().scale(yScale).orient('left');

//   let circleAttrs = {
//     cx: d => { return xScale(d.x); },
//     cy: d => { return yScale(d.y); },
//     r: d => { return radius + d.y / 5; },
//     fill: d => { return getColor(d.sentiment); }
//   };

//   let div = d3.select('body').append('div')	
//   .attr('class', 'tooltip')

//   var legend = svg.append("g")
//   .style("font-family", "Lato, Helvetica Neue, Helvetica, Arial, sans-serif")
//   .style("font-size", "14px")
//   .style('font-weight','bold')
//   .style("fill", "#2c3e50")
//   .attr("text-anchor", "end")
//   .selectAll("g")
//   .data(['positive', 'neutral', 'negative'])
//   .enter().append("g")
//   .attr("transform", function(d, i) { return "translate(75," + i * 20 + ")"; });

//   legend.append('circle')
//   .attr('cx', w - 150)
//   .attr('cy', 10)
//   .attr('r', 5)
//   // .style('fill', d => { return getColor(d) })
//   .style('fill', 'none')
//   .attr('stroke-width', 2)
//   .attr('stroke', d => { return getColor(d) })
//   // .attr('x', w - 150)
//   // .attr('width', 18)
//   // .attr('height', 18)
//   // .attr("fill", z);

//   legend.append('text')
//   .attr('x', w - 170)
//   .attr('y', 9.5)
//   .attr('dy', '0.32em')
//   .text(function(d) { return d; });

//   svg.selectAll('circle')
//   .data(data)
//   .enter()
//   .append('circle')
//   .attr(circleAttrs)
//   .on('mouseover', handleMouseOver)
//   .on('mouseout', handleMouseOut);



//   // Create Event Handlers for mouse
//   function handleMouseOver(d, i) {  // Add interactivity

//     // Use D3 to select element, change color and size
//     d3.select(this).attr({
//       fill: 'orange',
//       opacity: 0.5,
//       r: d => { return radius + d.y / 4; }
//     });

//     // Specify where to put label of text
//     svg.append('text').attr({
//       id: 't' + d.x + '-' + d.y + '-' + i,  // Create an id for text so we can select it later for removing on mouseout
//         x: () => { return xScale(d.x) - 30; },
//         y: () => { return yScale(d.y) - 15; }
//     })
//     // .text(() => {
//     //   return 'tweet:\n' + d.text;  // Value of the text
//     // });
//     div.transition()		
//       .duration(200)		
//       .style('opacity', .75);		
//     div
//       .html(d['sentiment'] + "<br/>" + d['text'])
//       .style("left", (d3.event.pageX) + "px")		
//       .style("top", (d3.event.pageY - 28) + "px");
//   }

//   function handleMouseOut(d, i) {
//     // Use D3 to select element, change color back to normal
//     d3.select(this).attr({
//       fill: d => { return getColor(d.sentiment); },
//       opacity: 1,
//       r: d => { return radius + d.y / 5; }
//     });

//     // Select text by id and then remove
//     d3.select('#t' + d.x + '-' + d.y + '-' + i).remove();  // Remove text location

//     div.transition()		
//     .duration(500)		
//     .style('opacity', 0);  
//   }

//   function getColor(score) {
//     if (score > 0.6 || score === 'positive') {
//       return 'green';
//     } else if (score < 0.4 || score === 'negative') {
//       return 'red';
//     } else {
//       return '#ffe13d';
//     }
//   }
// }