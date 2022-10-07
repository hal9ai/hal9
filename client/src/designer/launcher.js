
import { appVersion } from './version'

const designerLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAuCAYAAAA/SqkPAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAkGVYSWZNTQAqAAAACAAGAQYAAwAAAAEAAgAAARIAAwAAAAEAAQAAARoABQAAAAEAAABWARsABQAAAAEAAABeASgAAwAAAAEAAgAAh2kABAAAAAEAAABmAAAAAAAAAEgAAAABAAAASAAAAAEAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAHqADAAQAAAABAAAALgAAAADQOl+kAAAACXBIWXMAAAsTAAALEwEAmpwYAAADRmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj4xPC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzI8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+Mjg3PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj40NDQ8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KH7XFNAAACMdJREFUWAmtWA9snVUVP/d+3/vT9nVdNwaZjj8jgNJJs7llIxlru0XAEUX63l6h00Txb5QYF4N/E8LD/xuaGBWjMwuYSNAV2qUEZ1DX124CwyGIdkwRNlMlYeDW9e977/vuPf7Off26162sbx03ab/77nfv+d1z7jm/c+6n6ByNf746pj7zXBBN4YH0UiLdZNheoYgbiZUmRaeY1JBH+iXV2nV0eu6hT8dozc5QEXE0VvnE+NmNOadlVKmcZUil/ZkPM/NHMLRaaXURxfFaYamstpAbWLKWRjBnEEOPjU16Dza8v+uEyOC+Nl9tzIfSr2xnATN2qtbsdFqG/e1pxWq7rvWvIgMA7MIByrYEWJqMWTxlAzLua7Lj4TD63/Vaune4KbuzcdXRVZJ+1GYAR6DMWc8O2F16QeyjNB6QhW11XUw7zUrmTRhviBWdFCEQsBCPZdrXF1PSI8Z87MXqxoQ2J4uHPPI65Aj4DPBp4Mgk3JdNGW3+4C1OrrP/K0zopF9LoSUT2B7S6uFiIXi67qbe16Kdy5Of6bzEFEurISyDn1t1fSxpR0rjekG8zo6WRrW2G9WGPc9FiskaBzwNivM0/emnvMbE9Xa4OIqF9RDwolb0OdXS/SdZEDV39vgBi8PGpxv3Z642zDu8hvhtWFvQCS9pi3Y8MMHq5Kbef0Sa+7kcTuONJW6x7U/vmgId0/UO9De6pbtThHMODrf2YIwuvtTSqyct3bfCreHdg5qubNR0fEjTWCqEWV/GNtrNQPrLusbfbifCInykLj7JPQBdKWctivr3NmV99yOfbqc6/05oWsJ5psxI6VG/rfsO0YV/uzlBz1KgbtlbPK1b1+kukXHzYDHRiA6vCFVLbofpzxR1nf9DgBd0Q/xaq4LvYd4XZa4z9SHE66p3X34IO2ymkhFnOgJNm5ymZziFLJqrAdyjJW8oCSOA79K13sd5MpQzKYWhem9i02MwE9rKay//kE7Fmu1kGLhwIL7LgULTM8NgLlB5jzXOAtLXXrANGh+XqIPPxH2PP+nG5R+2slW2A0eIccn+Mdbas092PdO0bmbV/0RbOSJ1Q+8oFv0Yx0c04XjkNj5wa73mp7KLYO8bCKZw2lr+pZMOU1WN8lYTn13niEj79hH4dcAISx3TV1AYX6lh9Xch+JfIWjsWFD1PlcOmv0346IKayuWcDLV+zytKqRdVzCNKeCA6s0obpZYTSIk8p+AQhfVlcrg358LlgpCxOOJ98PgR8oEBqVbRlegiywgmgEGDJ1TbQ4ULBZuxvkvyBhqr4xG/K1II/Io240fF+NvSjYRPUZ5m1idEfck+GFsMZ6t5W4AiIYfLDAfhlwiAaG1JDWsk3KNCGi7taboU89/p1tyXK5soEjDPZ+RgAG2SZCPHqhUf1TGyR8BUr4tcxFrclMINDqM1HxlnnpAVjrW//Rpoep0tAdgxo35Bq417huHqA1Tru0Hs6E6H1Hbh4UR7kVTQrFVboZSHsCWAD42G6nmnlbX8iHPzkg28pL+B81s2S9lztK8tOV91Xe5FUjn1u+wiyPg8CISRhNBVPYtu7DrlgL3jXi9ePI8kESOYwyr7AL+8ObF8Y74wH3BJey51AqYuGf4EchfBp5QdLhWh889EGS1pTEgd/paTAWgvaXE5v1bTLb8FXDzd5WMZOEcTn+W+jyVpY96ITJNPf91LxTuRfIoqJVbnH6nWnpecNVxYdWW1mziQ2akXxj9lTxbHkElSPFJ6Qo0EHeqDj0844NZjcaJjIYFOI2916/NtHi2r8WjfcRuVwwD9BnLxPchMBvzsgaf/rWqDJrUGsqTyFAWkuFOqnMrC/vQBVCHrHXg9wEeDf1nF2/yW7icqlXWAGJD0OWO8P3sdK3O/SsVvtmMlkAOFSLkxM17q9Ft6fi1HqK7eW5yOVbcLSWVi1tD8XjUm19sThUkd92ok8DmwfZb4V57WeTp8bCjSzHHxvsGlFDdrjWVULCrtpWI+Eo5xoAviCTNafNJv7bnZpdqpXD0NLLuWSmQNbg5yVqi/foGz/oSLu8AycrWba4tmAp3/IiKF8UDvKG8VLYU5G1yyKboKRtKh1kp5ciNA7dGUkLOtsOwMYAGPNHf9/Vs+YK39NrRudpklxJYgSOwrDOSaGFrGUIrKHxxJUiGiRRV0YzyJI/uW19p9T6VcWRctl/50KztSHuRSvnqEA5kMJN2O1HY9Ji1z2pcNgDAAqISg5f+g1vubYt4EqR5CyOdC+Io6FTQ758S1SLghApkVOHrJgwi1FaevHixkUBtcZYy+zPNooSm7Fi5t9k0pl0w+81md0D+1Jcyo9T0zGWbhlI9WFvKR7Dmfu1F7iSfOFcd8sH0xLgMjvD/DfOh2RnT0inCcAoyAmvyMJhx2ztZR9kLDuXVazonqrylbafSfjIuARhkrR1KwBfWAuwSMIoTGA6QC/ooTvHdzXN2Sq6jHzwlX3UthPZkZ5Ntv5KezDI0D0RbPb8q4uwhIZ5Z2lglmmTPrkJgPbFeSIwD7bBevR/z44PxX9etezi3aXK4yZxMwb2DKl/O1bfvrF9TCxCpQ4wTV+CB/tc1xv9yzK7x4NvDzHoucZfzJW98Bs47jL+S/3MFhPu0SizDUXELnp/HOx53gZMK/H+xWi7hVuAeXUJPfPRfgvN9HDhP0Zd7Hz8Ch8ukCv9Apz6+JUOf5VUg/L40dyU9dVbXmHwhr6Rovgavt33Xqou9XgTc95byAKTXm4t70t98NEzfbwCIjSDagr8oHG3dJm6LZaYQL7QjtiQw+kL0MZh12DPXnDrYDmd1uHOQiLFUtTlUa53LINvhYJkKNMd/B7b4BJbFBJpooFnXZocBoZxYF1W7iLedJHpWXQf+WmxhaOodC+JiBzJdkXJKJPM+nzWmaqewrWZdQHBxUnlrrkpKxg/hc8Z7zAaucO7epHSS0AkWiu4CW1uECr/C1he8SQdWGTyVo1f0oJfJAphks9TDvxxciAZ0l3VUr9P8DmIQiYN/pzwAAAABJRU5ErkJggg==';

export const getDesignerLoaderHtml = (secret) => {
  return `
    <script>
      function hal9LoadDesigner() {
        window.parent.postMessage({ secret: ${secret}, id: 'designer' }, '*');
      }
    </script>
    <a target="_blank" href="https://hal9.com"><img src="${designerLogo}" style="position: absolute; right: 20px; top: 8px; width: 12px; cursor: pointer; z-index: 10000;" class="hal9-designer-loader"></a>
  `
}

export const launchDesigner = async (hal9, options, pid, backend) => {
  const script = document.createElement('script');
  const libraries = {
    local: 'http://localhost:8080/hal9.notebook.js',
    devel: 'https://devel.hal9.com/' + (options.version ?? appVersion.devel) + '/hal9.notebook.js',
    prod: 'https://hal9.com/' + (options.version ?? appVersion.prod) + '/hal9.notebook.js'
  }
  script.src = libraries[options.env];
  var waitLoad = new Promise((accept, reject) => {
    script.addEventListener('load', accept);
    script.addEventListener('error', reject);
  });

  document.head.appendChild(script);
  await waitLoad;

  if (!options.designer) {
    const html = typeof(options.html) === 'string' ? document.getElementById(options.html) : options.html;
    const designerHost = document.createElement('div');
    
    designerHost.style.height = html.style.height;
    html.parentNode.style.position = 'relative';
    html.style.position = 'absolute';

    const designer = document.createElement('div');
    options.designer = designer.id = 'hal-designer-' + Math.round(Math.random() * 1000);
    designerHost.appendChild(designer);

    html.parentNode.appendChild(designerHost);
  }

  await h9d.init({
    hal9: hal9,
    backend: backend,
    pid: pid,
    html: options.designer,
    output: options.html,
    debug: options.debug
  }, {});
}

export const registerDesignerLoader = (html, iframe, secret, pipeline) => {
  const onResult = function(event) {
    if (!event.data || event.data.secret != secret || event.data.id != 'designer') return;

    
  };

  window.addEventListener('message', onResult);
}
