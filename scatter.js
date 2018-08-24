plotScatter = (d3, data) => {
  let width = window.innerWidth,
     height = window.innerHeight;
  let min = max = 45;
  let sentiments = [];
  let polarity = { 'positive' : 0, 'neutral' : 0, 'negative' : 0};
  data.map(d => {
    sentiments.push(d.x)
    const sentiment = d.sentiment
    if (sentiment > 0)
        polarity.positive += 1
    else if (sentiment < 0)
      polarity.negative += 1
    else
      polarity.neutral += 1
  });
  let origin  = [width / 2, height / 2], startAngle = Math.PI/8, beta = startAngle;
  let svg     = d3.select('body')
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .call(d3.drag().on('drag', dragged).on('start', dragStart).on('end', dragEnd)).append('g');
  let color   = d3.scaleOrdinal(d3.schemeCategory10);
  let rn      = (min, max) => { return Math.round(d3.randomUniform(min, max + 1)()); };
  let mx, my, mouseX, mouseY;
  let rotate = [.0001, -.0001],
  time = Date.now(),
  timer;

  for (let i = sentiments.length; i >= 0; i--) {
    data[i] = ({
        ...data[i],
        x: rn(-min, max),
        y: rn(-min, max),
        z: rn(-min, max)
    });
  }

  let div = d3.select('body').append('div')	
            .attr('class', 'tooltip')

  let info = d3.select('body')
            .append('div')
            .attr('class', 'info')

  let _3d = d3._3d()
      .scale(5)
      .origin(origin)
      .rotateX(startAngle)
      .rotateY(startAngle)
      .primitiveType('POINTS');

  let data3D  = _3d(data);
  let extentZ = d3.extent(data3D, d => { return d.rotated.z });
  let zScale  = d3.scaleLinear().domain([extentZ[1]+10, extentZ[0]-10]).range([1, 8]);

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

  function processData(data) {
    let points = svg.selectAll('circle').data(data);
    points
      .enter()
      .append('circle')
      .on('click', d => {
        return window.open(`https://twitter.com/Interior/status/${d.id}`, '_blank');
      })
      .merge(points)
      .attr('fill', d => { return getColor(d.sentiment); })
      .attr('class', d => { return getColor(d.sentiment).replace(/#/, ''); })
      .sort((a, b) => { return d3.descending(a.rotated.z, b.rotated.z); })
      .attr('cx', d => { return d.projected.x; })
      .attr('cy', d => { return d.projected.y; })
      .attr('r' , d => { return zScale(d.rotated.z); })
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
    points.exit().remove();
  }


  function rotatePlot() {
    timer = d3.timer(() => {
      let dt = Date.now() - time;
      processData(_3d.rotateY(rotate[1] * dt / 2)(data));
    });
  }

  function stopRotatePlot() {
    timer.stop();
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
      .style('opacity', .75)
      .attr('fill', 'none')		
    div
      .html(
        `<div class='sentiment'>${d.sentiment}</div>
        <div class='text'>${d.text}</div>`
      )
      .style('left', (d3.event.pageX) + 'px')		
      .style('top', (d3.event.pageY - 28) + 'px')
    stopRotatePlot();
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

    rotatePlot();
  }

  function getColor(score) {
    if (score > 0 || score === 'positive') {
      return 'green';
    } else if (score < 0 || score === 'negative') {
      return 'red';
    } else {
      return '#ffe13d';
      // return 'yellow';
    }
  }

  function getPolarity(color) {
    switch(color) {
      case 'green' :
        return 'positive';
      case 'ffe13d' :
        return 'neutral'
      case 'red' :
        return 'negative';
    }
  }

  function focus(color) {
    stopRotatePlot();
    const pole = getPolarity(color)
    d3.selectAll('circle')
    .style('opacity', 0);
    d3.selectAll('.' + color)
    .style('opacity', 1);

    info.transition()		
      .duration(200)		
      .style('opacity', .75)
      .attr('fill', 'black')
    
    info
      .html(`${pole} ${polarity[pole]}`)
      .style('left', '10px')		
      .style('top', '10px')
  }

  function unfocus(color) {
    d3.selectAll('circle')
    .style('opacity', 1);

    info.transition()		
      .duration(500)		
      .style('opacity', 0);
    rotatePlot();
  }

  let legend = svg.append('g')
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
  .attr('x', width - 110)
  .attr('width', 18)
  .attr('height', 18)
  .attr('fill', d => { return getColor(d) })
  .on('mouseover', d => { return focus(getColor(d).replace(/#/, '')) })
  .on('mouseout', d => { return unfocus(getColor(d)) })

  legend.append('text')
  .attr('x', width - 130)
  .attr('y', 9.5)
  .attr('dy', '0.32em')
  .text(function(d) { return d; });

  rotatePlot();
}
