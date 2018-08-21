plotScatter = (d3, data) => {
  // http://bl.ocks.org/WilliamQLiu/76ae20060e19bf42d774

  let w = window.innerWidth,
      h = window.innerHeight,
      margin = { top: 40, right: 20, bottom: 20, left: 40 },
      radius = 10;

  let svg = d3.select("body").append("svg").attr({
    width: w,
    height: h
  });
  
  // We're passing in a function in d3.max to tell it what we're maxing (x value)
  let xScale = d3.scale.linear()
  .domain([0, d3.max(data, function (d) { return d.x + 10; })])
  .range([margin.left, w - margin.right]);  // Set margins for x specific

  // We're passing in a function in d3.max to tell it what we're maxing (y value)
  let yScale = d3.scale.linear()
  .domain([0, d3.max(data, function (d) { return d.y + 10; })])
  .range([margin.top, h - margin.bottom]);  // Set margins for y specific

  // Add a X and Y Axis (Note: orient means the direction that ticks go, not position)
  let xAxis = d3.svg.axis().scale(xScale).orient('top');
  let yAxis = d3.svg.axis().scale(yScale).orient('left');

  let circleAttrs = {
    cx: d => { return xScale(d.x); },
    cy: d => { return yScale(d.y); },
    r: d => { return radius + d.y / 5; },
    fill: d => { return getColor(d.sentiment); }
  };

  let div = d3.select('body').append('div')	
  .attr('class', 'tooltip')

  var legend = svg.append("g")
  .style("font-family", "Lato, Helvetica Neue, Helvetica, Arial, sans-serif")
  .style("font-size", "14px")
  .style('font-weight','bold')
  .style("fill", "#2c3e50")
  .attr("text-anchor", "end")
  .selectAll("g")
  .data(['positive', 'neutral', 'negative'])
  .enter().append("g")
  .attr("transform", function(d, i) { return "translate(75," + i * 20 + ")"; });

  legend.append('circle')
  .attr('cx', w - 150)
  .attr('cy', 10)
  .attr('r', 5)
  // .style('fill', d => { return getColor(d) })
  .style('fill', 'none')
  .attr('stroke-width', 2)
  .attr('stroke', d => { return getColor(d) })
  // .attr('x', w - 150)
  // .attr('width', 18)
  // .attr('height', 18)
  // .attr("fill", z);

  legend.append('text')
  .attr('x', w - 170)
  .attr('y', 9.5)
  .attr('dy', '0.32em')
  .text(function(d) { return d; });

  svg.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr(circleAttrs)
  .on('mouseover', handleMouseOver)
  .on('mouseout', handleMouseOut);



  // Create Event Handlers for mouse
  function handleMouseOver(d, i) {  // Add interactivity

    // Use D3 to select element, change color and size
    d3.select(this).attr({
      fill: 'orange',
      opacity: 0.5,
      r: d => { return radius + d.y / 4; }
    });

    // Specify where to put label of text
    svg.append('text').attr({
      id: 't' + d.x + '-' + d.y + '-' + i,  // Create an id for text so we can select it later for removing on mouseout
        x: () => { return xScale(d.x) - 30; },
        y: () => { return yScale(d.y) - 15; }
    })
    // .text(() => {
    //   return 'tweet:\n' + d.text;  // Value of the text
    // });
    div.transition()		
      .duration(200)		
      .style('opacity', .75);		
    div
      .html(d['sentiment'] + "<br/>" + d['text'])
      .style("left", (d3.event.pageX) + "px")		
      .style("top", (d3.event.pageY - 28) + "px");
  }

  function handleMouseOut(d, i) {
    // Use D3 to select element, change color back to normal
    d3.select(this).attr({
      fill: d => { return getColor(d.sentiment); },
      opacity: 1,
      r: d => { return radius + d.y / 5; }
    });

    // Select text by id and then remove
    d3.select('#t' + d.x + '-' + d.y + '-' + i).remove();  // Remove text location

    div.transition()		
    .duration(500)		
    .style('opacity', 0);  
  }

  function getColor(score) {
    if (score > 0.6 || score === 'positive') {
      return 'green';
    } else if (score < 0.4 || score === 'negative') {
      return 'red';
    } else {
      return '#ffe13d';
    }
  }
}