
export default function(html) {
  var script = '\nif (html) html.innerHTML = `' + html + '`;\n\n';

  script +=  `
    const scripts = [...html.getElementsByTagName('script')];
    for (var idx in scripts) {
      const script = scripts[idx];

      var tag = document.createElement("script");
      if (script.src) {
        tag.src = script.src;
        html.appendChild(tag);

        const loaded = new Promise(resolve => {
          tag.addEventListener('load', resolve);
        });

        await loaded;

        script.remove();
      }
      else {
        const fn = new Function(Object.keys(_hal9_params), script.innerHTML);
        fn(...Object.values(_hal9_params));
      }
    };
  `;

  return script;
}
