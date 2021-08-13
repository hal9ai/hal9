class XYChart extends GridChart {
  prepareScales() {
    super.prepareScales();

    this.xDomain = [d3.min(this.data, d => d[this.params.x]), d3.max(this.data, d => d[this.params.x])];
    this.yDomain = [
      d3.min(this.data, d => d.min || d3.min(d[this.params.y].map(v => v.value))),
      d3.max(this.data, d => d.max || d3.max(d[this.params.y].map(v => v.value))),
    ];

    const xDelta = (this.xDomain[1] - this.xDomain[0]) * 0.05;
    const yDelta = (this.yDomain[1] - this.yDomain[0]) * 0.05;

    if (this.xDomain[0] instanceof Date) {
      this.xDomain = [
        new Date(this.xDomain[0].getTime() - xDelta),
        new Date(this.xDomain[1].getTime() + xDelta)
      ];
      this.xScale = d3.scaleTime()
        .domain(this.xDomain)
        .range([0, this.width]);
    } else {
      this.xDomain = [this.xDomain[0] - xDelta, this.xDomain[1] + xDelta];
      this.xScale = d3.scaleLinear()
        .domain(this.xDomain)
        .range([0, this.width]);
    }

    this.yDomain = [this.yDomain[0] - yDelta, this.yDomain[1] + yDelta];

    this.yScale = d3.scaleLinear()
      .domain(this.yDomain)
      .range([this.height, 0]);

    if (this.params.color) {
      this.colorDomain = [
        d3.min(this.data, d => d[this.params.color]),
        d3.max(this.data, d => d[this.params.color]),
      ];
      this.colorScale = d3.scaleSequential(this.params.palette).domain(this.colorDomain);
    }
  }
}
