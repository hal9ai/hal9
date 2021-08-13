class BubbleChart extends XYChart {
  constructor(data = [], params = {}) {
    super(data, params);

    this.defaultSize = 10;
    this.params.sizeRange = this.params.sizeRange || [5, 10];
  }

  prepareScales() {
    super.prepareScales();

    if (this.params.size) {
      this.sizeDomain = [
        d3.min(this.data, d => d[this.params.size] || d3.min(d[this.params.y].map(v => v[this.params.size]))),
        d3.max(this.data, d => d[this.params.size] || d3.max(d[this.params.y].map(v => v[this.params.size]))),
      ];

      this.sizeScale = d3.scaleLinear()
        .domain(this.sizeDomain)
        .range(this.params.sizeRange);
    }
  }

  renderChart() {
    this.$svg
      .selectAll('.d3-circles-group')
      .remove();

    for (let i = 0; i < this.seriesCount; i++) {
      this.$svg
        .append('g')
        .attr('class', 'd3-circles-group')
        .selectAll('circle')
        .data(this.data)
        .enter()
        .append('circle')
        .attr('cx', d => this.xScale(d[this.params.x]))
        .attr('cy', d => this.yScale(d[this.params.y][i].value))
        .attr('r', d => this.sizeScale ? this.sizeScale(d[this.params.size]) : this.defaultSize)
        .attr('fill', d => typeof(d[this.params.color]) === 'string'
          ? this.categoryColorScale(d[this.params.color])
          : (this.colorScale ? this.colorScale(d[this.params.color]) : this.params.palette[1]));
    }
  }
}
