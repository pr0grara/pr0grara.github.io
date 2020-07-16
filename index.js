import * as Tone from 'tone';

document.addEventListener("DOMContentLoaded", function () {
  const synth = new Tone.Synth().toMaster();
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 500;
  canvas.height = 500;
  const file = document.getElementById('uploaded-file')

  document.getElementsByClassName('play-button')[0].addEventListener('click', function () {
    let { reds, greens, blues } = pick();
    let red = 0;
    let green = 0;
    let blue = 0;
    let x = 0;
    let y = 0;
    let interval = setInterval(() => {
      red = reds.shift();
      green = greens.shift();
      blue = blues.shift();
      //let tone = Math.floor(100 + (reds.shift() / 255) * 4000);
      let tone = Math.floor(100 + ((red + green + blue) / 765) * 4000);
      ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, .7)`
      //let tone = Math.floor(100 + (reds.shift() / blues.shift()) * 50);
      console.log(tone)
      ctx.fillRect(x, y, 500, 10)
      synth.triggerAttackRelease(tone, "16n");
      y += 10;
      if (reds.length < 1) {
        clearInterval(interval)
      }
      }, 100)
  })
        
  file.onchange = function (e) {
    var reader = new FileReader();
    reader.onload = function (event) {
      var img = new Image();
      img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      img.src = event.target.result;
      img.height = 500;
      img.width = 500;
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  function pick() {
    var pixdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var red = [];
    var green = [];
    var blue = [];
    var avgs = [];

    for (let i = 0; i < pixdata.data.length; i+=4) {
      red.push(pixdata.data[i])
      green.push(pixdata.data[i+1])
      blue.push(pixdata.data[i+2])
    }

    let data = {};
    let redchunk = []
    let greenchunk = []
    let bluechunk = []
    
    for (let j = 0; j < red.length; j+=5000) {
      let values = {
        red: red.slice(j, (j + 4999)),
        green: green.slice(j, (j + 4999)),
        blue: blue.slice(j, (j + 4999)), 
      }
      let redsum = values.red.reduce((previous, current) => current += previous);
      let greensum = values.green.reduce((previous, current) => current += previous);
      let bluesum = values.blue.reduce((previous, current) => current += previous);
      let redavg = Math.floor(redsum/values.red.length);
      let greenavg = Math.floor(greensum/values.red.length);
      let blueavg = Math.floor(bluesum/values.blue.length);
      // redchunk.push(Math.floor(red.slice(j, (j + 999)).reduce((a, b) => b += a)/1000));
      redchunk.push(redavg)
      greenchunk.push(greenavg)
      bluechunk.push(blueavg)
    }
    
    
    // console.log(red.slice(0,100).reduce((a, b) => b += a))
    console.log(redchunk)
    // console.log(Math.min(...red))
    // console.log(Math.max(...red))
    data = {
      reds: redchunk,
      greens: greenchunk,
      blues: bluechunk
    };
    return data;
  }
  canvas.addEventListener('click', pick);
})