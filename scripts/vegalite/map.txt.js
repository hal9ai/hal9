/**
  output: [ html ]
  deps:
    - https://cdn.jsdelivr.net/npm/vega@5
    - https://cdn.jsdelivr.net/npm/vega-lite@4
    - https://cdn.jsdelivr.net/npm/vega-lite-api@4
    - https://cdn.jsdelivr.net/npm/vega-tooltip
**/

const width = html.offsetWidth;
const height = html.offsetHeight;

const options = {
    config: {
    },
    init: (view) => {
        view.tooltip(new vegaTooltip.Handler().call);
    },
    view: {
        loader: vega.loader({
        baseURL: "https://cdn.jsdelivr.net/npm/vega-datasets@2/",
        }),
        renderer: "canvas",
    },
};

vl.register(vega, vegaLite, options);
 
vl.markSquare({ size: 2, opacity: 1 })
    .data('https://cdn.jsdelivr.net/npm/vega-datasets@2/data/zipcodes.csv')
    .transform(vl.calculate('substring(datum.zip_code, 0, 1)').as('digit'))
    .project(
        vl.projection('albersUsa')
    )
    .encode(
        vl.longitude().fieldQ('longitude'),
        vl.latitude().fieldQ('latitude'),
        vl.color().fieldN('digit')
    )
    .width(width)
    .height(Math.floor(width / 1.75))
    .autosize({type: 'fit-x', contains: 'padding'})
    .config({view: {stroke: null}})
    .render()
    .then(viewElement => {
        html.appendChild(viewElement);
    });

html.innerText = ' ';  
