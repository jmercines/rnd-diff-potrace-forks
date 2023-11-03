import { createSignal } from 'solid-js'
import Potrace from './helpers/potrace';
import { potrace, init } from 'esm-potrace-wasm'

function App() {
  const [img, setImg] = createSignal("");
  let svgContainer;
  let svgContainer2;

  function convert2svg(img) {
    setImg(img);

    svgContainer.innerHTML = ""
    svgContainer2.innerHTML = ""

    kilobyteConvert(img)
    esmPortrace(img)
  }

  function kilobyteConvert(img) {
    Potrace.loadImageFromUrl(img);
    Potrace.setParameter({
      // turnpolicy: how to resolve ambiguities in path decomposition. (default: "minority")
      // ("black" / "white" / "left" / "right" / "minority" / "majority")
      turnpolicy: "minority",
      // suppress speckles of up to this size (default: 2)
      turdsize: 0,
      // turn on/off curve optimization (default: true)
      optcurve: true,
      // corner threshold parameter (default: 1)
      alphamax: 1,
      // curve optimization tolerance (default: 0.2)
      opttolerance: 0.2
    });
    Potrace.process(() => {
      const svg = Potrace.getSVG(1);
      svgContainer.innerHTML = svg;
    })
  }

 async function esmPortrace(img) {
  let svg = ''
  await init()
  let blob = await fetch(img).then(res => res.blob());

  try {
    svg = await potrace(blob, {
      turdsize: 6, // 2
      turnpolicy: 4, // 4
      alphamax: 1, // 1
      opticurve: 1, // 1
      opttolerance: 0.9, // 0.2
      pathonly: false, // false
      extractcolors: true, // true
      posterizelevel: 1, // [1, 255] // 2
      posterizationalgorithm: 0, // 0: simple, 1: interpolation
    })
  } catch (error) {
    console.error(error)
    svg = "<p style='color:red'>Error Error Error Error Error Error Error</p>"
  }

    svgContainer2.innerHTML = svg
  }

  return (
    <>
      <div>
        <button onClick={ () => convert2svg('/lion-sample-1.jpg')}>Convert Lion 1</button>
        <button onClick={ () => convert2svg('/lion-sample-2.jpg')}>Convert Lion 2</button>
        <button onClick={ () => convert2svg('/lion-sample-3.jpg')}>Convert Lion 3</button>
      </div>

      <div>
        <div>
          <h3>Original</h3>
          <img width={300} src={img()}/>
        </div>
        <div>
          <h3>Potrace (kilobyte)</h3>
          <div ref={svgContainer}></div>
        </div>
        <div>
          <h3>Potrace (esm-potrace-wasm)</h3>
          <div ref={svgContainer2}></div>
        </div>
      </div>
    </>
  )
}

export default App
