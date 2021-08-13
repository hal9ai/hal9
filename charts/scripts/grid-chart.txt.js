class GridChart extends Chart {
  constructor(data = [], params = {}) {
    super(data, params);

    this.params.x = this.params.x || 'x';
    this.params.y = this.params.y || 'y';

    this.seriesCount = this.data.length
      ? this.data[0][this.params.y].length || 1
      : 0;

    this.params.palette = this.params.palette || ['#ffffff', d3.schemeCategory10[0]];
  }

  formatDecimalTick(ticks, value) {
    const delta = ticks.length > 1
      ? ticks[ticks.length - 1] - ticks[0]
      : value;

    if (delta < 1000) {
      const maxDecimals = ticks.reduce((res, v) => {
        return Math.floor(v) === v ? res : Math.max(res, v.toString().split('.')[1].length || 0);
      }, 0);
      return d3.format(`.${maxDecimals}~f`)(value);
    }
    return d3.format('~s')(value);
  }

  getXAxis() {
    if (typeof this.xScale.ticks !== 'function') {
      const ticks = this.xScale.domain();

       // filter ticks when overlapping: 10 pixels for 1 symbol in a label
      const tickWidth = Math.max(...ticks.map(t => t.toString().length)) * 10;
      const tickCount = Math.floor(this.width / tickWidth);
      const tickDelta = Math.max(Math.floor(ticks.length / tickCount), 1);

      return d3.axisBottom(this.xScale)
        .tickValues(ticks.filter((t, i) => i % tickDelta === 0));
    }

    const ticks = this.xScale.ticks();

    if (ticks[0] instanceof String || ticks[0] instanceof Date) {
      return d3.axisBottom(this.xScale);
    }

    return d3.axisBottom(this.xScale).tickFormat(d => this.formatDecimalTick(ticks, d));
  }

  getYAxis() {
    return d3.axisLeft(this.yScale).tickFormat(d => {
      if (typeof this.xScale.ticks !== 'function') return d;
      return this.formatDecimalTick(this.yScale.ticks(), d);
    });
  }

  render() {
    this.renderAxes();
    this.renderChart();
  }

  renderChart() {}

  renderAxes() {
    this.$svg
      .selectAll(['.d3-axis', '.d3-axis-gridline'])
      .remove();

    this.$svg.append('g')
      .attr('class', 'd3-axis d3-axis-x')
      .attr('transform', `translate(0,${this.height})`)
      .call(this.getXAxis());

    this.$svg.append('g')
      .attr('class', 'd3-axis d3-axis-y')
      .call(this.getYAxis());

    this.renderGridlines();
  }

  renderGridlines() {
    this.$svg.selectAll('.d3-axis-gridline').remove();

    this.$svg.selectAll('.d3-axis.d3-axis-y .tick')
      .append('line')
      .attr('class', 'd3-axis-gridline')
      .attr('x1', 0).attr('x2', this.width)
      .attr('y1', 0).attr('y2', 0);

    this.$svg.selectAll('.d3-axis.d3-axis-x .tick')
      .append('line')
      .attr('class', 'd3-axis-gridline')
      .attr('x1', 0).attr('x2', 0)
      .attr('y1', -this.height).attr('y2', 0);
  }

  updateAxes() {
    this.$svg
      .select('.d3-axis-x')
      .call(this.getXAxis());

    this.$svg
      .select('.d3-axis-y')
      .call(this.getYAxis());

    this.renderGridlines();
  }

  setParameter(name, value) {
    super.setParameter(name, value);

    this.prepareScales();
    this.updateAxes();
    this.renderChart();
  }
}
