class ErrorBarChart extends XYChart {
  constructor(data = [], params = {}) {
    super(data, params);

    this.params.padding = this.params.padding || 0.1;

    // Compute summary statistics used for each box
    this.data.forEach(value => {
      value.min = value[this.params.y][0];
      value.max = value[this.params.y][1];

      value.boxmin = value[this.params.y][2];
      value.boxmax = value[this.params.y][3];
      
      value.boxup = value.boxmax >= value.boxmin;
      if (!value.boxup) {
        var swap = value.boxmax;
        value.boxmax = value.boxmin;
        value.boxmin = swap;
      }

      value.points = value[this.params.y][4];
    });
  }

  prepareScales() {
    super.prepareScales();

    if (this.data.length) {
      this.bandwidth = d3.min(this.data.reduce((res, d, i) => {
        if (i < this.data.length - 1) {
          res.push(Math.abs(this.xScale(d.x) - this.xScale(this.data[i + 1][this.params.x])));
        }
        return res;
      }, []));
      this.bandwidth = Math.max(4, this.bandwidth * 0.75);
    }
  }

  renderChart() {
    this.$svg
      .selectAll('g.d3-error-bar')
      .remove();

    const bandwidth = this.bandwidth;

    this.data.forEach(value => {
      const $errorBars = this.$svg
        .append('g')
        .attr('class', 'd3-error-bar');

      // Show the main vertical line
      $errorBars.append('line')
        .attr('class', 'vertical')
        .attr('x1', this.xScale(value[this.params.x]) + bandwidth / 2)
        .attr('x2', this.xScale(value[this.params.x]) + bandwidth / 2)
        .attr('y1', this.yScale(value.min))
        .attr('y2', this.yScale(value.max));

      // Show the box
      $errorBars.append('rect')
        .attr('x', this.xScale(value[this.params.x]))
        .attr('y', this.yScale(value.boxmax))
        .attr('height', this.yScale(value.boxmin) - this.yScale(value.boxmax))
        .attr('width', bandwidth)
        .attr('fill', value.boxup ? '#00d800' : '#de7600');

      // show median, min and max horizontal lines
      if (value.points) {
        $errorBars.selectAll('line.quantile')
          .data(value.points)
          .enter()
          .append('line')
          .attr('class', 'quantile')
          .attr('x1', this.xScale(value[this.params.x]))
          .attr('x2', this.xScale(value[this.params.x]) + bandwidth)
          .attr('y1', d => this.yScale(d))
          .attr('y2', d => this.yScale(d));
      }
    });
  }
}

