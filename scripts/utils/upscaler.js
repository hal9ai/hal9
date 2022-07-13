/**
  output: [ upscaledImg ]
  params:
    - name: originalImg
      label: Image
      value:
        - control: textbox
          value: https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?cs=srgb&fm=jpg&h=108&w=162
    - name: model
      label: Scale
      value:
        - control: select
          value: div2k/rdn-C3-D10-G64-G064-x2
          values:
            - name: div2k/rdn-C3-D10-G64-G064-x2
              label: 2x
            - name: div2k/rdn-C3-D10-G64-G064-x3
              label: 3x
            - name: div2k/rdn-C3-D10-G64-G064-x4
              label: 4x
  deps:
    - https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.16.0/dist/tf.min.js
    - https://cdn.jsdelivr.net/npm/upscaler@0.12.1/dist/browser/umd/upscaler.js
  cache: true
  credit:
    - name: thekevinscott
    - url: https://upscalerjs.com/
**/

const upscaler = new Upscaler({
  model: model
});
let upscaledImg = await upscaler.upscale(originalImg);
