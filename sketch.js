const canvasSketch = require('canvas-sketch');
const {lerp} = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

// to see the seed in the inspector log and preserve the design
random.setSeed(random.getRandomSeed())
console.log(random.getSeed());


const settings = {
  dimensions: [2048, 2048],
  suffix: random.getSeed(), // save the img with teh seed number
  // units: 'cm',
  // orientation: 'landscape',
  // pixelsPerInch: 300 // common size for print artwork
};



const sketch = () => {
  const colorCount = random.rangeFloor(2,8);  // max exclusive 
  const palette = random.shuffle(random.pick(palettes))
  .slice(0, colorCount);  
  console.log(palette);

  const creategrid= () => {
    const points = [];
    const count = 50;

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);    // u and v are between 0 and 1  
        const v = count <= 1 ? 0.45 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v) * 0.2);      // u and v are between 0 and 1 
        points.push({
          color: random.pick(palette),
          radius , // random with a -ve radius can cause issue
          rotation : random.noise2D(u, v),
          position: [ u, v ]
        });
      }
    }
    return points;

  }
  // random.setSeed(512);  // same pattren , diff colours 
  const points = creategrid().filter(() => random.value() > 0.5 );  // even with random.value we end up w uniform distibution of num... https://github.com/mattdesl/canvas-sketch-util/blob/master/docs/random.md#gaussian
  //console.log(points);
  const margin = 300; 

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);


    points.forEach( data => {
      const {
        position,
        radius,
        color,
        rotation
      } = data;

      const [ u, v ] = position;
      const x = lerp(margin, width - margin, u);   // back to pixel size 
      const y = lerp(margin, height - margin, v);   

      // for circle design
      // context.beginPath();
      // context.arc(x, y, radius * width, 0, Math.PI * 2, false); // relative radius for diff screens 
      // context.fillStyle = color;
      // context.fill()

      context.save()
      context.fillStyle = color;
      context.font = `${radius * width}px "Arial"`;
      context.translate(x, y)
      context.rotate(rotation);  // rotated in radian
      context.fillText('=', 0, 0);

      context.restore()
    });
  };
};

canvasSketch(sketch, settings);
