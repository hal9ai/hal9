class SankeyChart extends Chart {
  constructor(data = [], params = {}) {
    super(data, params);

    this.params.nodeWidth = this.params.nodeWidth || 20;
  }

  prepareScales() {
    this.sankeyChart = d3.sankey()
      .nodeWidth(this.params.nodeWidth)
      .nodePadding(this.height / this.data.nodes.length)
      .size([this.width, this.height]);
  }

  render() {
    this.$svg
      .selectAll(['.d3-sankey-links', '.d3-sankey-nodes'])
      .remove();

    const sankeyData = this.sankeyChart(this.data);

    this.$svg.append('g')
      .attr('class', 'd3-sankey-links')
      .selectAll('path')
      .data(sankeyData.links)
      .enter()
      .append('path')
      .attr('d', d3.sankeyLinkHorizontal())
      .attr('stroke-width', d => d.width)
      .sort((a, b) => b.dy - a.dy);

    const node = this.$svg.append('g')
      .attr('class', 'd3-sankey-nodes')
      .selectAll('g')
      .data(sankeyData.nodes)
      .enter()
      .append('g');

    node.append('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', this.sankeyChart.nodeWidth())
      .style('fill', d => { return d.color = this.categoryColorScale(d.index); })
      .style('stroke', d => d3.rgb(d.color).darker(2));

    node.append('text')
      .attr('x', d => d.x0 - 6)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .text(d => d.name)
      .filter(d => d.x0 < this.width / 2)
      .attr('x', d => d.x1 + 6)
      .attr('text-anchor', 'start');
  }

  setParameter(name, value) {
    super.setParameter(name, value);

    this.prepareScales();
    this.render();
  }
}
