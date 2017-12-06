/**
 *
 */
const loadAndProcess = (theFile,data) => {
  const sample = T.loadImage(data);
  // Once the image is loaded, trigger the processing
  sample.then( (result) => {
    // Update image info
    let img = result.image;
    img.metadata.file = {};
    img.metadata.file.type = theFile.type || 'n/a';
    img.metadata.file.size = theFile.size || 'n/a';
    img.metadata.file.lastModified = new Date(theFile.lastModified).toLocaleDateString() || 'n/a';
    // Do the processing
    let win1 = new T.Window(theFile.name + ' - org');
    win1.addView(T.view(img.getRaster()));
    win1.addToDOM('workspace');
    /*
    let win2 = new T.Window(theFile.name);
    win2.addView(T.pipe(T.fromABGRtoUint8(T.luminance),T.noise(25.0),T.view)(img.getRaster()));
    win2.addToDOM('workspace');
    */
  });
};

/**
 * Action when input/file used
 */
const handleFileSelect = (evt) => {
  let files = evt.target.files; // FileList object

  // files is a FileList of File objects. List some properties.
  let output = [];
  for (let f of files) {
    // Only process image files.
    if (!f.type.match('image.*')) {
      continue;
    }

    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = ( (theFile) => (e) => loadAndProcess(theFile, e.target.result) )(f);

    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }
};


document.getElementById('files').addEventListener('change', handleFileSelect, false);


// Check endianness
// https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/
let buf = new ArrayBuffer(16);
let buf8 = new Uint8ClampedArray(buf);
let data = new Uint32Array(buf);
// Determine whether Uint32 is little- or big-endian.
data[0] = 0x0a0b0c0d;
console.log(buf);
console.log(buf8);
console.log(data);
let isLittleEndian = true;
if (buf[0] === 0x0a && buf[1] === 0x0b && buf[2] === 0x0c &&
  buf[3] === 0x0d) {
  isLittleEndian = false;
}
console.log(isLittleEndian);

