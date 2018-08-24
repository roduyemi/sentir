plotScatter = (d3, data) => {
  let width = window.innerWidth,
     height = window.innerHeight;
  let min = max = 45;
  let sentiments = [];
  data.map(d => {
    sentiments.push(d.x)
  });
  let origin  = [470, 300], startAngle = Math.PI/8, beta = startAngle;
  let svg     = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .call(d3.drag().on('drag', dragged).on('start', dragStart).on('end', dragEnd)).append('g');
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

  function dragStart() {
    mx = d3.event.x;
    my = d3.event.y;
  }

  function dragged() {
    mouseX = mouseX || 0;
    mouseY = mouseY || 0;
    beta   = (d3.event.x - mx + mouseX) * Math.PI / 360 * (-1);
    theta = (d3.event.y - my + mouseY) * Math.PI / 360 * (-1);
    processData(_3d.rotateX(theta + startAngle)(data));
    processData(_3d.rotateY(beta + startAngle)(data));
      
  }

  function dragEnd() {
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
      .attr('fill', d => { return getColor(d.sentiment); })
      .attr('class', d => { return getColor(d.sentiment); })
      // .attr('stroke', function(d, i){ return d3.color(color(i)).darker(0.5); })
      .sort((a, b) => { return d3.descending(a.rotated.z, b.rotated.z); })
      .attr('cx', d => { return d.projected.x; })
      .attr('cy', d => { return d.projected.y; })
      .attr('r' , d => { return zScale(d.rotated.z); })
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut);
      points.exit().remove();
  }

  function handleMouseOver(d, i) {
    const radius = d3.select(this).attr('r');
    d3.select(this)
      .attr('fill', 'orange')
      .attr('opacity', 0.5)
      .attr('r', radius * 1.5)

    svg.append('text').attr({
      id: 't' + d.x + '-' + d.y + '-' + i,
        x: () => { return xScale(d.x) - 30; },
        y: () => { return yScale(d.y) - 15; }
    })

    div.transition()		
      .duration(200)		
      .style('opacity', .75);		
    div
      .html(d['sentiment'] + '<br/>' + d['text'])
      .style('left', (d3.event.pageX) + 'px')		
      .style('top', (d3.event.pageY - 28) + 'px');
  }

  function handleMouseOut(d, i) {
    const radius = d3.select(this).attr('r');
    d3.select(this)
      .attr('fill', d => { return getColor(d.sentiment); })
      .attr('opacity', 1)
      .attr('r', radius / 1.5)

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
      // return '#ffe13d';
      return 'yellow';
    }
  }

  function focus(color) {
    // let orgOpacity = d3.selectAll('.'+color).style('opacity');
    // let opacity = orgOpacity === '1' ? '0' : '1';

    // console.log('org opacity', orgOpacity)
    // console.log('opacity', opacity)

    // d3.selectAll('circle')
    // .style('opacity', orgOpacity);
    // d3.selectAll('.'+color)
    // .style('opacity', opacity);
    d3.selectAll('circle')
    .style('opacity', 0);
    d3.selectAll('.' + color)
    .style('opacity', 1);
  }

  function unfocus(color) {
    d3.selectAll('circle')
    .style('opacity', 1);
  }

  var legend = svg.append('g')
  .style('font-family', 'Lato, Helvetica Neue, Helvetica, Arial, sans-serif')
  .style('font-size', '14px')
  .style('font-weight','bold')
  .style('fill', '#2c3e50')
  .attr('text-anchor', 'end')
  .selectAll('g')
  .data(['positive', 'neutral', 'negative'])
  .enter().append('g')
  .attr('transform', (d, i) => { return 'translate(75,' + i * 20 + ')'; });

  legend.append('rect')
  // .attr('cx', 960 - 150)
  // .attr('cy', 10)
  // .attr('r', 5)
  // // .style('fill', d => { return getColor(d) })
  // .style('fill', 'none')
  // .attr('stroke-width', 2)
  // .attr('stroke', d => { return getColor(d) })
  .attr('x', width - 150)
  .attr('width', 18)
  .attr('height', 18)
  .attr('fill', d => { return getColor(d) })
  .on('mouseover', d => { return focus(getColor(d)) })
  .on('mouseout', d => { return unfocus(getColor(d)) })
  // .on('click', d => { return focus(getColor(d)) })

  legend.append('text')
  .attr('x', width - 170)
  .attr('y', 9.5)
  .attr('dy', '0.32em')
  .text(function(d) { return d; });

  processData(data3D);
}
