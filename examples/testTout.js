/*
 *  TIMES: Tiny Image ECMAScript Application
 *  Copyright (C) 2017  Jean-Christophe Taveau et al.
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
 * Peter Bock
 * Cecilia Ostertag
 * Ophelie Thierry
 */


/**
 * Display uint8 images
 */


let imageName = "Clown";
let image_pixels = clown_pixels;
let x = 320;
let y = 200;

let img1 = new T.Image('rgba',x,y);
img1.setPixels(image_pixels);
let win0 = new T.Window(imageName);
let view0 = T.view(img1.getRaster());
// Create the window content from the view
win0.addView(view0);
// Add the window to the DOM and display it
win0.addToDOM('workspace');




// Testing Sobel

let testSobel = sobel(img1);
let win1 = new T.Window(imageName + ' Sobel');
let view1 = T.view(testSobel.getRaster());
// Create the window content from the view
win1.addView(view1);
// Add the window to the DOM and display it
win1.addToDOM('workspace');




// Testing Prewitt

let testPrewitt = prewitt(img1);
let win2 = new T.Window(imageName +' Prewitt');
let view2 = T.view(testPrewitt.getRaster());
// Create the window content from the view
win2.addView(view2);
// Add the window to the DOM and display it
win2.addToDOM('workspace');




// Testing Robert's Cross

let testRobert = robertscross(img1);
let win3 = new T.Window(imageName + " Robert's cross");
let view3 = T.view(testRobert.getRaster());
// Create the window content from the view
win3.addView(view3);
// Add the window to the DOM and display it
win3.addToDOM('workspace');





// Testing LoG

let testLoG = LoG(img1);
let win4 = new T.Window(imageName + " LoG");
let view4 = T.view(testLoG.getRaster());
// Create the window content from the view
win4.addView(view4);
// Add the window to the DOM and display it
win4.addToDOM('workspace');




// Testing Canny

let testCanny = canny(img1,50,60);
let win6 = new T.Window(imageName + ' Canny');
let view6 = T.view(testCanny.getRaster());
// Create the window content from the view
win6.addView(view6);
// Add the window to the DOM and display it
win6.addToDOM('workspace');




// Testing Testing Greyscale conversion

let greyclown = to8bit(img1);
let win5 = new T.Window("Grey " + imageName);
let view5 = T.view(greyclown.getRaster());
// Create the window content from the view
win5.addView(view5);
// Add the window to the DOM and display it
win5.addToDOM('workspace');
