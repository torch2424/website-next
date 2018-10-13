// see comment in assembly/index.ts on why this is useful
function rgb2bgr(rgb) {
  return ((rgb >>> 16) & 0xff) | (rgb & 0xff00) | ((rgb & 0xff) << 16);
}

export function gameOfLife(canvasElement, wasmPath) {

  // Configuration
  const RGB_ALIVE = 0xd392e6;
  const RGB_DEAD = 0xa61b85;
  const BIT_ROT = 10;
  // Set up the canvas with a 2D rendering context
  var cnv = canvasElement;
  var ctx = cnv.getContext("2d");
  var bcr = cnv.getBoundingClientRect();
  // Compute the size of the universe (here: 2px per cell)
  var width = bcr.width >>> 1;
  var height = bcr.height >>> 1;
  var size = width * height;
  var byteSize = (size + size) << 2; // input & output (here: 4b per cell)
  cnv.width = width;
  cnv.height = height;
  ctx.imageSmoothingEnabled = false;
  // Compute the size of and instantiate the module's memory
  var memory = new WebAssembly.Memory({
    initial: ((byteSize + 0xffff) & ~0xffff) >>> 16
  });
  // Fetch and instantiate the module
  fetch(wasmPath)
    .then(response => response.arrayBuffer())
    .then(buffer =>
      WebAssembly.instantiate(buffer, {
        env: {
          memory,
          abort: function() {}
        },
        config: {
          BGR_ALIVE: rgb2bgr(RGB_ALIVE) | 1, // little endian, LSB must be set
          BGR_DEAD: rgb2bgr(RGB_DEAD) & ~1, // little endian, LSB must not be set
          BIT_ROT
        },
        Math
      })
    )
    .then(module => {
      var exports = module.instance.exports;
      // Initialize the module with the universe's width and height
      exports.init(width, height);
      var mem = new Uint32Array(memory.buffer);
      // Update about 30 times a second
      (function update() {
        setTimeout(update, 1000 / 30);
        mem.copyWithin(0, size, size + size); // copy output to input
        exports.step(); // perform the next step
      })();
      // Keep rendering the output at [size, 2*size]
      var imageData = ctx.createImageData(width, height);
      var argb = new Uint32Array(imageData.data.buffer);
      (function render() {
        requestAnimationFrame(render);
        argb.set(mem.subarray(size, size + size)); // copy output to image buffer
        ctx.putImageData(imageData, 0, 0); // apply image buffer
      })();
      // When clicked or dragged, fill the current row and column with random live cells
      var down = false;
      [[cnv, "mousedown"], [cnv, "touchstart"]].forEach(eh =>
        eh[0].addEventListener(eh[1], e => (down = true))
      );
      [[document, "mouseup"], [document, "touchend"]].forEach(eh =>
        eh[0].addEventListener(eh[1], e => (down = false))
      );
      [[cnv, "mousemove"], [cnv, "touchmove"], [cnv, "mousedown"]].forEach(eh =>
        eh[0].addEventListener(eh[1], e => {
          if (!down) return;
          var loc;
          if (e.touches) {
            if (e.touches.length > 1) return;
            loc = e.touches[0];
          } else {
            loc = e;
          }
          var bcr = cnv.getBoundingClientRect();
          exports.fill(
            (loc.clientX - bcr.left) >>> 1,
            (loc.clientY - bcr.top) >>> 1,
            0.5
          );
        })
      );
      // :-(
      if (navigator.userAgent.indexOf(" Edge/") >= 0)
        document.getElementById("edge").style.display = "block";
    })
    .catch(err => {
      alert("Failed to load WASM: " + err.message + " (ad blocker, maybe?)");
      console.log(err);
    });
}
