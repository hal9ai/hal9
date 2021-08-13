class TreemapChart extends Chart {
  constructor(data = [], params = {}) {
    super(data, params);

    this.params.padding = params.padding || 2;
    this.textPadding = { top: 15, left: 5 };
  }

  prepareScales() {
    this.hierarchy = d3.hierarchy(this.data).sum(d => d.value);

    d3.treemap()
      .size([this.width, this.height])
      .padding(this.params.padding)
      (this.hierarchy);
  }

  render() {
    this.$svg
      .selectAll('g.d3-treemap')
      .remove();

    const $treemap = this.$svg
      .append('g')
      .attr('class', 'd3-treemap');
    const leaves = this.hierarchy.leaves();

    $treemap.selectAll('rect')
      .data(leaves)
      .enter()
      .append('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', this.categoryColorScale());

    $treemap.selectAll('text')
      .data(leaves)
      .enter()
      .append('text')
      .text(d => d.data.name);

    $treemap.selectAll('text')
      .attr('x', d => d.x0 + this.textPadding.left)
      .attr('y', d => d.y0 + this.textPadding.top)
      .text((d, i, elements) => {
        const bbox = elements[i].getBBox();
        const fits = (d.x1 - d.x0) > bbox.width + this.textPadding.left * 2 &&
          (d.y1 - d.y0) > bbox.height + this.textPadding.top * 2;
        return fits ? d.data.name : '';
      });
  }
}
