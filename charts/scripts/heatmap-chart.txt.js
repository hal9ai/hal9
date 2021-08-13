class HeatmapChart extends GridChart {
  prepareScales() {
    this.xDomain = Object.keys(this.data[Object.keys(this.data)[0]]);
    this.xScale = d3.scaleBand()
      .range([0, this.width])
      .domain(this.xDomain);

    this.yDomain = Object.keys(this.data);
    this.yScale = d3.scaleBand()
      .range([this.height, 0])
      .domain(this.yDomain);

    this.colorDomain = [
      d3.min(Object.keys(this.data), d => d3.min(Object.keys(this.data[d]), v => this.data[d][v])),
      d3.max(Object.keys(this.data), d => d3.max(Object.keys(this.data[d]), v => this.data[d][v])),
    ];
    this.colorScale = d3.scaleLinear()
      .range(this.params.palette)
      .domain(this.colorDomain);

    this.$svg.select('.d3-axis-x').call(d3.axisBottom(this.xScale));
    this.$svg.select('.d3-axis-y').call(d3.axisLeft(this.yScale));

    // TODO: consider changing data format here
    this.heatmapData = Object.keys(this.data).reduce((res, row) => {
      Object.keys(this.data[row]).forEach(col => {
        res.push({ row, col, value: this.data[row][col] });
      });
      return res;
    }, []);
  }

  renderChart() {
    this.$svg
      .selectAll('rect')
      .remove();

    this.$svg.selectAll('rect')
      .data(this.heatmapData)
      .enter()
      .append('rect')
      .attr('x', d => this.xScale(d.col))
      .attr('y', d => this.yScale(d.row))
      .attr('width', this.xScale.bandwidth())
      .attr('height', this.yScale.bandwidth())
      .style('fill', d => this.colorScale(d.value));
  }
}

