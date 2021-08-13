class LineChart extends XYChart {
  prepareScales() {
    super.prepareScales();

    this.lines = [];
    if (this.data.length) {
      for (let i = 0; i < this.seriesCount; i++) {
        this.lines.push({
          key: this.data[0][this.params.y][i].key,
          line: d3.line()
            .x(d => this.xScale(d[this.params.x]))
            .y(d => this.yScale(d[this.params.y][i].value))
        });
      }
    }
  }

  renderChart() {
    this.$svg
      .selectAll('path.d3-line')
      .remove();

    this.lines.forEach(({ key, line }) => {
      this.$svg.append('path')
        .datum(this.data)
        .attr('class', 'd3-line')
        .attr('d', line)
        .attr('stroke', d => this.categoryColorScale(key));
    });
  }
}
