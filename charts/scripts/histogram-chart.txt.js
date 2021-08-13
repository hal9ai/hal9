class HistogramChart extends GridChart {
  constructor(data = [], params = {}) {
    super(data, params);

    this.params.padding = this.params.padding || 1;
    this.params.thresholds = this.params.thresholds || 10;
  }

  prepareScales() {
    this.xDomain = [d3.min(this.data, d => d[this.params.y]), d3.max(this.data, d => d[this.params.y])];
    this.xScale = d3.scaleLinear().domain(this.xDomain).range([0, this.width]);

    this.histogram = d3.histogram()
      .value(d => d[this.params.y])
      .domain(this.xScale.domain())
      .thresholds(this.xScale.ticks(this.params.thresholds));

    this.bins = this.histogram(this.data);

    this.yDomain = [0, d3.max(this.bins, d => d.length) * 1.1];
    this.yScale = d3.scaleLinear()
      .domain(this.yDomain)
      .range([this.height, 0]);
  }

  renderChart() {
    this.$svg
      .selectAll('rect')
      .remove();

    this.$svg.selectAll('rect')
      .data(this.bins)
      .enter()
      .append('rect')
      .attr('x', this.params.padding)
      .attr('transform', d => `translate(${this.xScale(d.x0)},${this.yScale(d.length)})`)
      .attr('width', d => Math.max(this.xScale(d.x1) - this.xScale(d.x0) - this.params.padding * 2, 0))
      .attr('height', d => this.height - this.yScale(d.length))
      .attr('fill', d => this.categoryColorScale());
  }
}
