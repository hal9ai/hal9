class BarChart extends GridChart {
  constructor(data = [], params = {}) {
    super(data, params);

    this.params.padding = this.params.padding || 0.1;
  }

  prepareScales() {
    this.xDomain = this.data.map(d => d[this.params.x]);
    this.xScale = d3.scaleBand()
      .domain(this.xDomain)
      .range([0, this.width])
      .padding(this.params.padding);

    this.xInnerDomain = this.seriesCount > 0 ? this.data[0][this.params.y].map(el => el.key) : [];
    this.xInnerScale = d3.scaleBand()
      .domain(this.xInnerDomain)
      .rangeRound([0, this.xScale.bandwidth()]);

    if (this.params.stacked) {
      this.stackedData = d3.stack().keys(this.xInnerDomain)(this.data.map(d => {
        const res = { [this.params.x]: d[this.params.x] };
        d[this.params.y].forEach(c => res[c.key] = c.value);
        return res;
      }));

      this.yDomain = [
        d3.min(this.stackedData, d => d3.min(d.map(v => v[0]))),
        d3.max(this.stackedData, d => d3.max(d.map(v => v[1]))),
      ];
    } else {
      this.yDomain = [
        d3.min(this.data, d => d3.min(d[this.params.y].map(v => v.value))),
        d3.max(this.data, d => d3.max(d[this.params.y].map(v => v.value))),
      ];
    }

    const yDelta = (this.yDomain[1] - this.yDomain[0]) * 0.1;

    this.yDomain = [this.yDomain[0], this.yDomain[1] + yDelta];
    this.yScale = d3.scaleLinear()
      .domain(this.yDomain)
      .range([this.height, 0]);

    this.$svg.select('.d3-axis-y')
      .call(d3.axisLeft(this.yScale));
  }

  renderChart() {
    this.$svg
      .selectAll('.d3-bar-group')
      .remove();

    if (this.params.stacked) {
      this.$svg.selectAll('.d3-bar-group')
        .data(this.stackedData)
        .enter()
        .append('g')
        .attr('class', 'd3-bar-group')
        .attr('fill', d => this.categoryColorScale(d.key))
        .selectAll('rect')
        .data(d => d)
        .enter()
        .append('rect')
        .attr('x', d => this.xScale(d.data[this.params.x]))
        .attr('y', d => this.yScale(d[1]))
        .attr('height', d => this.yScale(d[0]) - this.yScale(d[1]))
        .attr('width', Math.max(this.xScale.bandwidth(), 1));
    } else {
      this.$svg.selectAll('.d3-bar-group')
        .data(this.data)
        .enter()
        .append('g')
        .attr('class', 'd3-bar-group')
        .attr('transform', d => `translate(${this.xScale(d[this.params.x])},0)`)
        .selectAll('rect')
        .data(d => d[this.params.y])
        .enter()
        .append('rect')
        .attr('x', d => this.xInnerScale(d.key))
        .attr('width', Math.max(this.xInnerScale.bandwidth(), 1))
        .attr('y', d => this.yScale(d.value))
        .attr('height', d => this.height - this.yScale(d.value))
        .attr('fill', d => this.categoryColorScale(d.key));
    }
  }
}
