/*
 *  TIMES: Tiny Image ECMAScript Application
 *  Copyright (C) 2017  Jean-Christophe Taveau.
 *
 *  This file is part of TIMES
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,Image
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with TIMES.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

/**
 * Class for Window
 * @alias T.Window
 */
 
export default class Window {
  /**
   * Create an empty Window.
   * 
   * @param {string} title - Window Title
   * @param {number} width - Window Width
   * @param {number} height - Window Height
   * @param {boolean} forceCPU - By default, all the processing is done in CPU and not in GPU
   *
   * @author Jean-Christophe Taveau
   */
  constructor(title,forceCPU=true) {
    /**
     * Title
     */
    this.title = title;
    
    
    // Build HTML5 elements
    this.root = document.createElement('article');
    this.root.className = "twindow";
    this.root.name = this.title;
    this.root.id = this.title.toLowerCase(); //  + '-' + wm.windows.length;
    this.root.style.left = `${Math.random()*1200}px`;
    this.root.style.top = `${Math.random()*400}px`;
    let header = document.createElement('header');
    header.className = 'theader';
    header.innerHTML = `<label>${title}</label>`;
    this.root.appendChild(header);
    let body = document.createElement('content');
    let footer = document.createElement('footer');
    footer.className = 'tfooter';
    this.root.appendChild(header);
    this.root.appendChild(body);
    this.root.appendChild(footer);

    // Move by click & drag 
    let offset = [];
    const move = (e) => {
      header.parentNode.style.top  = (e.clientY + offset[1]) + 'px';
      header.parentNode.style.left = (e.clientX + offset[0]) + 'px';
    };
    const mouseUp = (e) => {
      e.target.parentNode.style.zIndex = 1;
      window.removeEventListener('mousemove', move, true);
    }
    const mouseDown = (e) => {
      e.target.parentNode.style.zIndex = 99;
      offset = [this.root.offsetLeft - e.clientX, this.root.offsetTop - e.clientY];
      window.addEventListener('mousemove', move, true);
    }
    header.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

    this.element;
    


    // Try to get HW Acceleration
    this.useGPU = !forceCPU;
    /*
    if (!forceCPU) {
      // Get WEBLG 2 context
      this.ctx = this.canvas.getContext("webgl2");
      // no webgl2 for you!
      this.useGPU = (!this.ctx) ? false : true;
    }
    if (!this.useGPU) {
      this.ctx = this.canvas.getContext('2d');
      this.useGPU = false;
    }
    */
  }

  /**
   * Add a view to this window
   *
   * @alias T.Window~addView
   * @param {View} a_view - View
   *
   * @author Jean-Christophe Taveau
   */
  addView(a_view) {
    /*
     * Create an empty canvas
     */
    const createCanvas = (layerData) => {
      let canvas = document.createElement('canvas');
      canvas.layerData = layerData;
      this.element = canvas;
      
      if (!this.useGPU) {
        this.ctx = this.element.getContext('2d');
      }
      // HACK console.log(`${layerData.width} x ${layerData.height} `);
      canvas.width = layerData.width;
      canvas.height = layerData.height;
      this.root.childNodes[1].appendChild(canvas);
      let info = document.createElement('p'); 
      info.className = 'tstatus';
      info.id = this.root.id + '_status';
      info.appendChild(document.createTextNode('') );
      this.root.childNodes[2].appendChild(info);

      // Add events
      // TODO - What about CSS geometric transforms?
      // See https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
      canvas.addEventListener('mousemove', function(evt) {
        let canvas = evt.target;
        let the_view = evt.target.parentNode.parentNode.tview;
        let rect = canvas.getBoundingClientRect();
        let x = Math.floor(evt.clientX - rect.left);
        let y = Math.floor(evt.clientY - rect.top);
        let pixels = canvas.layerData.raster.pixelData;
        let w = canvas.layerData.raster.width;
        let pix = (the_view.layers[0].data.raster.type === 'float32') ? pixels[x + y * w] : pixels[x + y * w] >>>0;
        let message = `(${x},${y}): ${pix}`;
        if (the_view.layers[0].data.raster.type === 'rgba' || the_view.layers[0].data.raster.type === 'abgr') {
          message = `(${x},${y}): rgba(${T.red(pix)},${T.green(pix)},${T.blue(pix)},${T.alpha(pix)})`;
        }
        let info = canvas.parentNode.nextSibling;
        info.innerHTML = message;
      });
      // TODO Zoom in/out
      // TODO http://phrogz.net/tmp/canvas_zoom_to_cursor.html
      // TODO this.ctx.scale(2.0,2.0);
      // TODO Translate canvas
      // TODO this.ctx.translate(10.0,20.0)
      // TODO this.ctx.drawImage(win.canvas,0,0);
    };

    /* 
     * Create an empty table
     */
    const createTable = () => {
      this.element = document.createElement('table');
      this.root.childNodes[1].appendChild(this.element);
    };
  
    // M A I N
    this.root.tview = a_view;
    // Create all the HTML5 stuff...
    for (let layer of a_view.layers) {
      switch (layer.type) {
        case 'image':
        createCanvas(layer.data);
        break;
      case 'table': 
        createTable(layer.data);
        break;
      default: // Unknown
        // TODO
      }
    }
  }
  
  /**
   * Add this window to DOM and display its contents
   *
   * @alias T.Window~addToDOM
   * @author Jean-Christophe Taveau
   */
   addToDOM(parent) {
    this.root.tview.render(this);
    // show() - Add canvas to the workspace in DOM
    document.getElementById(parent).appendChild(this.root);
   }

}
