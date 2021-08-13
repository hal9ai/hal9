class Chart {
  constructor(data = [], params = {}) {
    this.data = data;
    this.params = params;
    this.margin = params.margin || { top: 25, right: 25, bottom: 25, left: 25 };

    this.categoryColorScale = d3.scaleOrdinal(d3.schemeCategory10);

    window.addEventListener('resize', this.resize.bind(this));
  }

  appendTo($container) {
    this.$container = $container;
    
    var me = this;
    const observer = new ResizeObserver(entries => {
      me.resize();
    });
    observer.observe(this.$container);

    this.resize();
  }

  removeSvg() {
    this.$svg.remove();
    this.$container.innerHTML = '';
  }

  prepareSVG() {
    this.$svg = d3.select(this.$container)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
  }

  prepareScales() {}

  render() {}

  resize() {
    if (this.$svg) this.removeSvg();

    this.width = this.$container.clientWidth - this.margin.left - this.margin.right;
    this.height = this.$container.clientHeight - this.margin.top - this.margin.bottom;

    this.prepareSVG();
    this.prepareScales();
    this.render();
  }

  setParameter(name, value) {
    this.params[name] = value;
  }

  setData(data) {
    this.data = data;

    this.prepareScales();
    this.render();
  }
}
