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

const brush = vl.selectInterval().encodings('x');
const click = vl.selectMulti().encodings('color');

const scale = {
    domain: ['sun', 'fog', 'drizzle', 'rain', 'snow'],
    range: ['#e7ba52', '#a7a7a7', '#aec7e8', '#1f77b4', '#9467bd']
};

const plot1 = vl.markPoint({ filled: true })
    .encode(
        vl.color().value('lightgray')
        .if(brush, vl.color().fieldN('weather').scale(scale).title('Weather')),
        vl.size().fieldQ('precipitation').scale({domain: [-1, 50], range: [10, 500]}).title('Precipitation'),
        vl.order().fieldQ('precipitation').sort('descending'),
        vl.x().timeMD('date').axis({title: 'Date', format: '%b'}),
        vl.y().fieldQ('temp_max').scale({domain: [-5, 40]}).axis({title: 'Maximum Daily Temperature (°C)'})
    )
    .width(width)
    .height(300)
    .select(brush)
    .transform(vl.filter(click));

const plot2 = vl.markBar()
    .encode(
        vl.color().value('lightgray')
        .if(click, vl.color().fieldN('weather').scale(scale).title('Weather')),
        vl.x().count(),
        vl.y().fieldN('weather').scale({domain: scale.domain}).title('Weather')
    )
    .width(width)
    .select(click)
    .transform(vl.filter(brush));

vl.vconcat(plot1, plot2)
    .data('https://cdn.jsdelivr.net/npm/vega-datasets@2/data/seattle-weather.csv')
    .autosize({ type: 'fit-x', contains: 'padding' })
    .render()
    .then(viewElement => {
        html.appendChild(viewElement);
    });

html.innerText = ' '; 
