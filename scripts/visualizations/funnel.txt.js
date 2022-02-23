/**
  input: [ data ]
  output: [ html ]
  params:
  - name: stage
    label: Stage
  - name: value
    label: Value
  - name: label
    label: Label
  - name: fontSize
    label: Font Size
    value:
    - control: range
      value: 12
      min: 8
      max: 30
  - name: showPercentSelection
    label: Show Percent
    value:
    - control: select
      value: 'true'
      values:
      - name: 'true'
        label: Yes
      - name: 'false'
        label: No
  - name: funnelType
    label: Show Percent
    value:
    - control: select
      value: '2d'
      values:
      - name: '2d'
        label: '2D'
      - name: '3d'
        label: '3D'
      - name: 'flat'
        label: Flat
  - name: palette
    label: D3 Palette
    value:
    - control: paletteSelect
      value: schemeTableau10
      values:
      - schemeTableau10
      - schemeAccent
      - schemeDark2
      - schemePaired
      - schemeSet1
      - schemeSet2
      - schemeSet3
  deps:
    - https://cdn.jsdelivr.net/npm/hal9-utils@latest/dist/hal9-utils.min.js
    - https://cdn.jsdelivr.net/npm/d3@6
  credit:
    - name: analyzer2004
    - url: https://twitter.com/analyzer2004
**/

data = await hal9.utils.toRows(data);

data = data.map((e, idx) => {
  return {
  stage: e[stage],
  value: e[value] ? e[value] : (data.length - idx) * 100 / data.length,
  label: e[label],
  }
})

class FunnelChart {
  constructor(container) {
    this._container = container;

    // Groups
    this._g = null;

    // Visual elements and selections
    this._infoBox = null;
    this._textBox = null;
    this._charBox = null;

    // Base variables and constants    
    this._width = 0;     
    this._height = 0;
    this._offset = 30;
    this._hw = 0;
    this._funnelWidth = { max: 0, min: 0 };

    // Scales
    this._y = null;
    this._color = null;

    // Data
    this._data = null;
    this._chartData = null;
    this._total = 0;
    this._streamlined = true;

    // Options
    this._options = {
      palette: d3.schemeTableau10,
      style: "3d", // 2d, 3d
      streamlined: true,
      percentage: "first", // first, previous
      showPercentage: true
    };

    // Font
    this._font = {
      fontFamily: "sans-serif",
      size: {
        label: fontSize * 1,
        value: fontSize * 1.3,
        percentage: fontSize
      }
    }

    this._field = {
      stage: 'stage',
      value: 'value',
      label: 'label'
    };

    this._tooltip = {
      color: "black",
      boxColor: "white",
      boxOpacity: 0.8
    };    
    
    // events
    this._onhover = null;
    this._onclick = null;
  }

  size(_) {
    return arguments.length ? (this._width = _[0], this._height = _[1], this) : [this._width, this._height];
  }

  options(_) {
    return arguments.length ? (this._options = Object.assign(this._options, _), this) : this._options;
  }

  font(_) {
    return arguments.length ? (this._font = Object.assign(this._font, _), this) : this._font;
  }

  field(_) {
    return arguments.length ? (this._field = Object.assign(this._field, _), this) : this._field;
  }

  tooltip(_) {
    return arguments.length ? (this._tooltip = Object.assign(this._tooltip, _), this) : this._tooltip;
  }

  data(_) {
    return arguments.length ? (this._data = [..._], this) : this._data;
  }

  onhover(_) {
    return arguments.length ? (this._onhover = _, this) : this._onhover;
  }

  onclick(_) {
    return arguments.length ? (this._onclick = _, this) : this._onclick;
  }

  render() {
    this._init();
    this._process();
    this._initScales();
    this._render();
    return this;
  }

  _init() {
    this._streamlined = this._options.streamlined;
    
    this._hw = this._width / 2;
    this._funnelWidth.max = this._width * 0.65;

    this._funnelWidth.min = this._width * 0.15;

    this._textBox = this._container
      .append("text")
      .attr("font-family", this._font.fontFamily)
      .style("visibility", "hidden");
    this._getCharBox();
  }

  _process() {
    if (this._streamlined) {
      this._processStreamlined();
    }
    else {
      this._processPartToWhole();
    }
  }

  _processStreamlined() {
    this._chartData = [];
    this._data.sort((a, b) => +b[this._field.value] - +a[this._field.value]);

    for (let i = 1; i < this._data.length; i++) {
      const
        d = this._data[i],
        value = +d[this._field.value];

      let denominator = 1;
      if (this._options.percentage === "first")
        denominator = +this._data[0][this._field.value];
      else if (this._options.percentage === "previous")
        denominator = i === 0 ? value : +this._data[i - 1][this._field.value];

      this._chartData.push({
        stage: d[this._field.stage],
        value: value,
        label: d[this._field.label],
        vs: +this._data[i - 1].value,
        ve: value,
        pct: value / denominator
      });
    }
  }

  _processPartToWhole() {
    let t = 0;
    this._chartData = this._data.map((d, i) => {
      const
        vs = t,
        value = +d[this._field.value];

      t += value;
      return {
        stage: d[this._field.stage],
        label: d[this._field.label],
        value: value,
        vs: vs,
        ve: t,
        pct: 0
      };
    });

    this._total = t;
    this._chartData.forEach(d => d.pct = d.value / t);
  }

  _initScales() {
    this._y = d3.scaleLinear().range([this._streamlined ? 30 : 0, this._height]);
    if (this._streamlined)
      this._y.domain(d3.extent(this._data.map(d => +d[this._field.value])).reverse());            
    else
      this._y.domain([0, this._total]);      

    this._color = d3.scaleOrdinal()
      .domain(this._chartData.map(d => d.stage))
      .range(this._options.palette);
  }

  _render() {
    this._g = this._container
      .append("g")
      .attr("font-family", this._font.fontFamily);

    this._renderLabels();
    if (this._options.style === "3d")
      this._renderFunnel2();      
    else
      this._renderFunnel1();
  }

  _renderLabels() {    
    const offset = this._options.style === "3d" ? 5 : 1;

    if (this._streamlined) {
      const first = this._data[0];
      this._g.append("text")
        .attr("text-anchor", "middle")        
        .attr("font-size", this._font.size.label)
        .attr("font-weight", "bold")
        .attr("fill", "#666")
        .attr("x", this._width / 2)
        .attr("y", 25)        
        .text(`${first[this._field.stage]} = ${ first[this._field.label] ? first[this._field.label] : d3.format(".3s")(first[this._field.value])}`);
    }

    const data = this._chartData
      .filter(d => this._y(d.ve) - this._y(d.vs) > this._charBox.height);

    const labels = this._g
      .selectAll("label")
      .data(data)
      .join("g")
      .attr("class", "label")
      .attr("font-size", this._font.size.label)
      .attr("font-weight", "bold")
      .attr("fill", "#666")
      .call(g => {
        const line = g
          .append("line")
          .attr("stroke", "#666")
          .attr("stroke-dasharray", "1,2");

        if (this._streamlined) {
          line
            .attr("x1", 0).attr("y1", d => this._y(d.ve) - offset)
            .attr("x2", this._hw).attr("y2", d => this._y(d.ve) - offset);
        }
        else {          
          line
            .attr("x1", 0).attr("y1", d => this._y(d.vs + d.value * 0.75))
            .attr("x2", this._hw).attr("y2", d => this._y(d.vs + d.value * 0.75));
        }

        g
          .append("text")
          .attr("x", 0)
          .attr("y", d => this._y(this._streamlined ? d.ve : d.vs + d.value * 0.75) - offset)
          .attr("dy", "-0.2em")
          .text(d => d.stage)
      });

    this._attachEvents(labels);
  }

  _renderLayers(layer, shadow) {
    return this._g
      .selectAll("layer")
      .data(this._chartData)
      .join("g")
      .attr("class", "layer")
      .call(g => {
        g
          .append("path")
          .attr("fill", d => this._color(d.stage))
          .attr("d", layer)
      })
      .call(g => {
        g
          .append("path")
          .attr("fill", d => d3.color(this._color(d.stage)).darker(0.5))
          .attr("d", shadow)
      });
  }

  _renderNumbers(target, t) {    
    const ah = this._options.showPercentage ? this._charBox.height * 2 : this._charBox.height;
    const filtered = target
      .filter(d => this._y(d.ve) - this._y(d.vs) > ah);

    filtered.call(g => {
      g
        .append("text")
        .attr("fill", "white")
        .attr("font-size", this._font.size.value)
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .attr("transform", t)
        .text(d => d.label ? d.label : d3.format(".3s")(d.value));

      if (this._options.showPercentage) {
        g
          .append("text")
          .attr("fill", "white")
          .attr("font-size", this._font.size.percentage)
          .attr("text-anchor", "middle")
          .attr("transform", t)
          .attr("dy", "1em")
          .text(d => d3.format(".1%")(d.pct));
      }
    });
  }

  _renderFunnel1() {
    const
      that = this,
      { left, right } = this._getLinearEquationSet1();

    const layers = this._renderLayers(layer, shadow);
    this._renderNumbers(
      layers,
      d => {
        if (this._streamlined) {
          const y1 = this._y(d.vs), y2 = this._y(d.ve);
          return `translate(${this._hw},${y1 + (y2 - y1) / 2})`;
        }
        else {
          return `translate(${this._hw},${this._y(d.vs + d.value / 2)})`;
        }
      }   
    );

    if (this._options.style === "2d") {
      layers.attr("transform", (d, i) => {
        return `translate(${i % 2 === 0 ? -5 : 5},0)`;
      });
    }

    this._attachEvents(layers);

    function layer(d) {
      const
        y0 = that._y(d.vs), y1 = that._y(d.ve),
        x00 = left(y0), x01 = right(y0),
        x10 = left(y1), x11 = right(y1);

      return `M${x00},${y0}L${x01},${y0}L${x11},${y1}L${x10},${y1}L${x00},${y0}`;
    }

    function shadow(d, i) {
      if (i > 0 && that._options.style === "2d") {
        const
          y0 = that._y(d.vs),
          y1 = that._streamlined ? that._y(d.vs) + (that._y(d.ve) - that._y(d.vs)) / 5 : that._y(d.vs + d.value / 5),
          w = (that._hw - left(y0)) * 1.5, // 2 * 0.75
          x00 = i % 2 === 0 ? right(y0) : left(y0), x01 = i % 2 === 0 ? x00 - w : x00 + w,
          x10 = i % 2 === 0 ? right(y1) : left(y1);

        return `M${x00},${y0}L${x10},${y1}L${x01},${y0}L${x00},${y0}`;
      }
    }
  }

  _getLinearEquationSet1() {
    const left = this._x(
      (this._width - this._funnelWidth.max) / 2, 0,
      (this._width - this._funnelWidth.min) / 2, this._height
    );
    const right = this._x(
      (this._width - this._funnelWidth.max) / 2 + this._funnelWidth.max, 0,
      (this._width - this._funnelWidth.min) / 2 + this._funnelWidth.min, this._height,
    );

    return { left, right };
  }

  _renderFunnel2() {
    const
      that = this,      
      { pa, pc, xb, xt } = this._getLinearEquationSet2();

    const layers =
      this._renderLayers(layer, shadow)
        .call(g => {
          g
            .append("path")
            .attr("fill", d => d3.color(this._color(d.stage)).darker(0.7))
            .attr("d", bottom)
        });

    const
      x1 = (this._width - this._funnelWidth.max * 1 / 3) / 2, y1 = 0,
      x2 = (this._width - this._funnelWidth.max) / 2 + this._funnelWidth.max, y2 = this._offset,
      a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    this._renderNumbers(
      layers,
      d => {
        if (this._streamlined) {
          const
            y1 = this._y(d.vs), y2 = this._y(d.ve),
            py = y1 + (y2 - y1) / 2, px = xt(py);
          return `translate(${px},${py}) skewY(${a})`;
        }
        else {
          const py = this._y(d.vs + d.value / 2), px = xt(py);
          return `translate(${px},${py}) skewY(${a})`;
        }
      }
    );

    this._attachEvents(layers);

    function layer(d) {
      const
        ys = that._y(d.vs), ye = that._y(d.ve) - 10,
        y00 = ys, y01 = ye, x00 = xb(y00), x01 = xb(y01),
        p0 = pc(ys), p1 = pc(ye);

      return `M${x00},${y00}L${p0.x},${p0.y}L${p1.x},${p1.y}L${x01},${y01}L${x00},${y00}`;
    }

    function shadow(d) {
      const
        ys = that._y(d.vs), ye = that._y(d.ve) - 10,
        y00 = ys, y01 = ye, x00 = xb(y00), x01 = xb(y01),
        p0 = pa(ys), p1 = pa(ye);

      return `M${x00},${y00}L${p0.x},${p0.y}L${p1.x},${p1.y}L${x01},${y01}L${x00},${y00}`;
    }

    function bottom(d) {
      const
        y = that._y(d.ve) - 10,
        y00 = y, x00 = xb(y00),
        p0 = pa(y), p1 = pc(y);

      return `M${x00},${y00}L${p0.x},${p0.y}L${p1.x},${p1.y}L${x00},${y00}`;
    }
  }

  _getLinearEquationSet2() {
    const mb = (x1, y1, x2, y2) => {
      const m = (y2 - y1) / (x2 - x1), b = y1 - m * x1;
      return { m, b };
    };

    // Second line
    const xb = y => {
      const
        x1 = (this._width - this._funnelWidth.max * 1 / 3) / 2, y1 = 0,
        x2 = (this._width - this._funnelWidth.min) / 2 * 1.05, y2 = this._height;
      return this._x(x1, y1, x2, y2)(y);
    };

    // Text line
    const xt = y => {
      const
        xa = (this._width - this._funnelWidth.max * 1 / 3) / 2,
        xb = (this._width - this._funnelWidth.max) / 2 + this._funnelWidth.max,
        x1 = xa + (xb - xa) / 2, y1 = 0;
      const
        xc = (this._width - this._funnelWidth.min) / 2 * 1.05,
        xd = (this._width - this._funnelWidth.min) / 2 + this._funnelWidth.min,
        x2 = xc + (xd - xc) / 2, y2 = this._height;
      return this._x(x1, y1, x2, y2)(y);
    };

    const p = (x11, x12, x22, y) => {
      // Line 1
      const y11 = 0, y12 = this._height;
      // Line 2
      const x21 = xb(y), y21 = y, y22 = y21 + this._offset;

      const
        l1 = mb(x11, y11, x12, y12),
        l2 = mb(x21, y21, x22, y22);

      const
        px = (l2.b - l1.b) / (l1.m - l2.m),
        py = l1.m * px + l1.b;

      return { x: px, y: py };
    }

    // Left line
    const pa = y => p(
      (this._width - this._funnelWidth.max) / 2,
      (this._width - this._funnelWidth.min) / 2,
      (this._width - this._funnelWidth.max) / 2,
      y);

    // Right line
    const pc = y => p(
      (this._width - this._funnelWidth.max) / 2 + this._funnelWidth.max,
      (this._width - this._funnelWidth.min) / 2 + this._funnelWidth.min,
      (this._width - this._funnelWidth.max) / 2 + this._funnelWidth.max,
      y);    

    return { pa, pc, xb, xt };
  }

  _x(x1, y1, x2, y2) {
    const
      m = (y2 - y1) / (x2 - x1),
      b = y1 - m * x1;

    return y => (y - b) / m;
  }

  _attachEvents(target) {
    target
      .on("pointerenter", (e, d) => {
        this._showTooltip(e, d);
        if (this._onhover) this._onhover(d);
      })
      .on("pointermove", (e, d) => {
        this._moveTooltip(e);
      })
      .on("pointerleave", () => {
        this._hideTooltip();
      });
  }

  _showTooltip(e, d) {
    const info = [d.stage, d3.format(",")(d.value), d3.format(".2%")(d.pct)];

    var max = 0;
    info.forEach(s => {
      const l = this._calcTextLength(s);
      if (l > max) max = l;
    })

    if (!this._infoBox)
      this._infoBox = this._g
        .append("g")
        .attr("fill", this._tooltip.color)
        .call(g => g.append("rect")
          .attr("class", "ibbg")
          .attr("opacity", this._tooltip.boxOpacity)
          .attr("stroke", "#aaa")
          .attr("stroke-width", 0.5)
          .attr("rx", 4).attr("ry", 4)
          .attr("x", -5).attr("y", -5)
          .attr("fill", this._tooltip.boxColor));

    const spacing = 1.1;
    this._infoBox
      .style("visibility", "visible")
      .select(".ibbg")
      .attr("width", max + 20).attr("height", spacing * this._charBox.height * info.length + 5);

    this._infoBox
      .selectAll("text")
      .data(info)
      .join(
        enter => {
          enter
            .append("text")
            .attr("dy", (d, i) => `${spacing * i + 1}em`)
            .attr("font-weight", (d, i) => i === 0 ? "bold" : "")
            .text(d => d.label ? d.label : d);
        },
        update => update.text(d => d.label ? d.label : d),
        exit => exit.remove()
    );

    this._moveTooltip(e);
  }

  _getSVG() {
    let curr = this._container.node();
    while (curr && curr.tagName !== "svg")
      curr = curr.parentElement;
    return curr;
  }

  _moveTooltip(e) {
    const svg = this._getSVG();
    if (svg) {
      // convert to SVG coordinates
      const
        p = svg.createSVGPoint(),
        box = this._infoBox.node().getBBox(),
        gr = this._g.node().getBoundingClientRect();
      p.x = e.clientX;
      p.y = e.clientY;
      const converted = p.matrixTransform(this._g.node().getScreenCTM().inverse());

      const
        left = converted.x + box.width + gr.left > this._width ? converted.x - box.width : converted.x,
        top = converted.y + box.height + gr.top > this._height ? converted.y - box.height : converted.y;

      this._infoBox.attr("transform", `translate(${left + 10},${top + 10})`);
    }
  }

  _hideTooltip(d) {
    if (this._infoBox) this._infoBox.style("visibility", "hidden");
  }

  _calcTextLength(text) {
    return this._textBox.text(text).node().getBBox().width;
  }

  _getCharBox() {
    this._charBox = this._textBox.text("M").node().getBBox();
  }
}

const svg = d3.create("svg")  
  .attr("cursor", "default")
  .attr("viewBox", [0, 0, html.offsetWidth, html.offsetHeight]);

html.appendChild(svg.node());

new FunnelChart(svg)
  .size([ html.offsetWidth, html.offsetHeight ])
  .options({ 
  palette: d3[palette], 
  style: funnelType,
  showPercentage: showPercentSelection == 'true',
  percentage: 'first'
  })
  .data(data)
  .render();
