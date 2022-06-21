let buffer1, buffer2;

let mySound;
let tamanioFuente;
let button;
let miTextura;
let miFuente;
let misPinceles = [];
let misTexturasPinceles = [];

var escala = 1.005;
///////////////////////////////////////77 PRELOAD
function preload() {
  mySound = loadSound(
    "https://cdn.glitch.global/bee415d4-7968-44e3-b990-559c3eb84a3a/atentaOGG2.ogg?v=1654291489499"
  );
  miFuente = loadFont('assets/ELI5.0B-.TTF');
  miTextura = loadImage('assets/27.png');

  for (let i = 0; i < 29; i++) {
    misTexturasPinceles[i] = loadImage('assets/' + i + '.png');
  }


}
////////////////////////////////SETUP
function setup() {
  createCanvas(windowWidth, windowHeight);
  buffer1 = createGraphics(windowWidth, windowHeight, WEBGL);
  buffer2 = createGraphics(windowWidth, windowHeight, WEBGL);

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
  setAttributes('depth', true);


}


/*DRAW******************************************************************* */
function draw() {

  buffer1.push();
  buffer1.noStroke();

  buffer1.texture(buffer2); // meto la textura de salida en la entrada
  buffer1.translate(0, 0, -2);
  buffer1.plane(windowWidth, windowHeight); // dibujo la textura de salida en la entrada

  //hago todo lo que quiero hacer

  //  buffer1.texture(wiley);

  //  cg.translate(sin(frameCount *0.05)*200, cos(frameCount *0.01)*200);
  //buffer1.translate(sin(frameCount*0.01),cos(frameCount*0.01));
  // buffer1.translate(-100, -100,-50);
  //buffer1.rotateX(frameCount * 0.01);
  //buffer1.rotateY(frameCount * 0.01);
  //buffer1.plane(200,200);
  //buffer1.translate(-1000, -500, -50);
  /*
    for (let i = 0; i < misPinceles.length; i++) {
      //misPinceles[i].mover();
      misPinceles[i].moverNoise();
      misPinceles[i].dibujar3d(i);
    }*/
  
    for (let i = 0; i < misPinceles.length; i++) {
      //misPinceles[i].mover();
     misPinceles[i].moverNoise();
      misPinceles[i].dibujar3d(i);
    }
  // buffer1.texture(misTexturasPinceles[1]);
  // buffer1.plane(misTexturasPinceles[1].width, misTexturasPinceles[1].height);




  buffer1.pop();

  //meto lo que hice en la imagen de salida para reusarla despues
  buffer2.push();
  buffer2.noStroke();
  buffer2.scale(1.001, 1.05); //hago transformaciones
  buffer2.texture(buffer1); //meto la textura de salida
  buffer2.plane(windowWidth, windowHeight); //dibujo la textura de salida
  buffer2.pop();

  image(buffer2, 0, 0, windowWidth, windowHeight);

  dibujarLinea();
  dibujarTexto();

}
////////////////////////objeto pincel


class Pincel {

  constructor() {

    this.x = random(0, windowWidth);
    this.y = random(0, windowHeight);
    this.posZ = random(0.0, -1)

    this.posicionAnteriorX = this.x;
    this.posicionAnteriorY = this.y;
    this.xoffset = random(10);
    this.velocidadOffset = random(0.001, 0.0015);
    this.posicion = 0;
  }





  moverNoise() {
    this.x += map(noise(this.xoffset), 0, 1, -0.5, 0.5);
    this.xoffset += this.velocidadOffset;
  }



  dibujar3d(i) {
    buffer1.push();
    //buffer1.translate(-100,-100);
    // buffer1.imageMode(CENTER);
    // buffer1.translate(this.x, this.y, this.posZ);
    // buffer1.texture(misTexturasPinceles[i]);
    // buffer1.noStroke();
    // buffer1.plane(misTexturasPinceles[i].width, misTexturasPinceles[i].height);
    // buffer1.pop();
    buffer1.translate(-windowWidth/2, -windowHeight/2);
    buffer1.translate(this.x, this.y);
    buffer1.texture(misTexturasPinceles[i]);
    buffer1.plane(misTexturasPinceles[i].width, misTexturasPinceles[i].height);
    buffer1.pop();
  }



}

//// dibujar linea

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
    mySound.stop();
  } else {
    mySound.play();
  }
  background(0);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}