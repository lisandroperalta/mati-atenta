let buffer1, buffer2;

let mySound;
let tamanioFuente;
let button;
let miTextura;
let miDedo;


let miFuente;
let misPinceles = [];
let misTexturasPinceles = [];

let ratioDeEscala = 1;


///////////////////////////////////////77 PRELOAD
function preload() {
  mySound = loadSound(
    "https://cdn.glitch.global/bee415d4-7968-44e3-b990-559c3eb84a3a/atentaOGG2.ogg?v=1654291489499"
  );
  miFuente = loadFont('assets/ELI5.0B-.TTF');
  miTextura = loadImage('assets/27.png');
  miDedo = loadImage('assets/dedo.png');

  for (let i = 0; i < 29; i++) {
    misTexturasPinceles[i] = loadImage('assets/' + i + '.png');
  }


}
////////////////////////////////SETUP
function setup() {
  createCanvas(windowWidth, windowHeight);
  buffer1 = createGraphics(windowWidth, windowHeight, WEBGL);
  buffer2 = createGraphics(windowWidth, windowHeight, WEBGL);
  ratioDeEscala = windowWidth / 1920;

  tamanioFuente = windowWidth / 20;
  button = createButton("play/stop");
  button.position(10, 10);
  button.mousePressed(reproducir);
  for (let i = 0; i < 29; i++) {

    misPinceles[i] = new Pincel();
  }


  background(0);
  frameRate(30);
  smooth();
  setAttributes('antialias', true);
  setAttributes('depth', false);

  setAttributes('stencil', true);

}


/*DRAW******************************************************************* */
function draw() {
  //dibujarLinea();
  buffer1.push();
  buffer1.noStroke(0);
  buffer1.translate(0, 0, 0);
  buffer1.texture(buffer2); // meto la textura de salida en la entrada
  buffer1.plane(windowWidth, windowHeight); // dibujo la textura de salida en la entrada  

  //hago todo lo que quiero hacer
  buffer1.translate(-windowWidth / 2, -windowHeight / 2); //CORRIJO TRANSLATE DE WEBGL

  dibujarDedo();
  buffer1.noStroke();
  buffer1.blendMode(DIFFERENCE);
  for (let i = 0; i < misPinceles.length; i++) {
    //misPinceles[i].mover();
    misPinceles[i].moverNoise();
    misPinceles[i].dibujar3d(i);
  }

  dibujarTexto3D();
  buffer1.pop();



  //meto lo que hice en la imagen de salida para reusarla despues
  buffer2.push();
  buffer2.noStroke();

  let noiseTranslateX = map(noise(frameCount * 0.005 + 150), 0, 1, -5, 5);
  let noiseTranslateY = map(noise(frameCount * 0.005), 0, 1, -5, 5);
  let noiseScale = map(noise(frameCount * 0.005+750), 0, 1, 0.999, 1.01);

  buffer2.translate(noiseTranslateX, noiseTranslateY); //hago transformaciones

  //buffer2.rotate(radians(0.2));
  buffer2.texture(buffer1); //meto la textura de salida
  buffer2.scale(noiseScale); //hago transformaciones
  buffer2.plane(windowWidth, windowHeight); //dibujo la textura de salida
  buffer2.pop();

  image(buffer2, 0, 0, windowWidth, windowHeight);

  if (!focused) {
    mySound.pause();
  }

}
////////////////////////objeto pincel


class Pincel {

  constructor() {

    this.reiniciarPincel();
  }
  reiniciarPincel() {
    var margen = 200 * ratioDeEscala;
    this.x = random(0 + margen, windowWidth - margen);
    this.y = random(0 + margen * 4, windowHeight - margen * 4);
    this.posZ = random(0.0, -1)
    this.posicionAnteriorX = this.x;
    this.posicionAnteriorY = this.y;
    this.xoffset = random(10);
    this.yoffset = random(10);
    this.velocidadOffsetx = random(0.001, 0.0015);
    this.velocidadOffsety = random(0.001, 0.0015);
    this.posicion = 0;




  }
  moverNoise() {
    this.x += map(noise(this.xoffset), 0, 1, -0.5, 0.5);
    this.xoffset += this.velocidadOffsetx;
    this.y += map(noise(this.yoffset), 0, 1, -0.5, 0.5);
    this.yoffset += this.velocidadOffsety;

  }

  dibujar3d(i) {
    buffer1.push();


    buffer1.translate(this.x, this.y);
    buffer1.texture(misTexturasPinceles[i]);

    buffer1.plane(misTexturasPinceles[i].width * ratioDeEscala, misTexturasPinceles[i].height * ratioDeEscala, 150, 150);
    buffer1.pop();
  }



}

//// dibujar linea

function dibujarDedo() {
  if (mouseX != pmouseX || mouseY != pmouseY) {
    push();
    imageMode(CENTER);
    buffer1.tint(255);
    let escalaDedo = ratioDeEscala * 500;
    buffer1.image(miDedo, mouseX - escalaDedo / 2, mouseY - escalaDedo / 2, escalaDedo, escalaDedo);
    pop();

  }

}


function dibujarLinea() {
  if (mouseX != pmouseX || mouseY != pmouseY) {
    push();
    stroke(
      cos(frameCount * 0.05) * 255,
      sin(frameCount * 0.01) * 255,
      sin(frameCount * -0.03) * 255
    );

    strokeWeight(25);
    // translate(windowWidth * -.5, windowHeight * -.5);
    line(mouseX, mouseY, pmouseX, pmouseY);

    pop();
  }
}


/////////////////////////  dibujar texto


function dibujarTexto3D() {
  push();
  buffer1.stroke(0);
  buffer1.strokeWeight(2);
  buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
  buffer1.textSize(90);
  // buffer1.tamanioFuente = 500;
  buffer1.textFont(miFuente);
  buffer1.translate(windowWidth / 2, windowHeight / 2)
  translate(0, 0);
  buffer1.text(ratioDeEscala, 0, 0);
  pop();
}



function dibujarTexto() {
  push();
  stroke(0);
  strokeWeight(2);
  fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
  textSize(windowWidth / 20);
  tamanioFuente = windowWidth / 20;
  textFont(miFuente);

  //translate(0,0);

  text(mySound.currentTime(), windowWidth * .1, windowHeight * 0.9);

  if (mySound.currentTime() >= 0.01 && mySound.currentTime() <= 1) {
    // fill(255);
    strokeWeight(3);
    textSize(tamanioFuente);
    text("Nuevo ciclo y vos estas", windowWidth * .1, windowHeight * 0.1);
  }
  if (mySound.currentTime() >= 2.5 && mySound.currentTime() <= 3.7) {
    // fill(255);
    strokeWeight(3);
    textSize(tamanioFuente);
    text("ATENTA", windowWidth * .1, windowHeight * 0.2);
  }
  if (mySound.currentTime() >= 5 && mySound.currentTime() <= 8) {
    // fill(255);
    strokeWeight(3);
    textSize(tamanioFuente);
    text("Todo pasa en cualquier momento", windowWidth * .1, windowHeight * 0.3);
  }


  pop();

}


/////////// extras
function reproducir() {
  if (mySound.isPlaying()) {
    mySound.
    mySound.stop();
  } else {
    mySound.play();
  }


  background(0);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buffer1.resizeCanvas(windowWidth, windowHeight);
  buffer2.resizeCanvas(windowWidth, windowHeight);
  background(0);
  for (let i = 0; i < misPinceles.length; i++) {
    //misPinceles[i].mover();
    misPinceles[i].reiniciarPincel();

  }
  ratioDeEscala = windowWidth / 1920;
}