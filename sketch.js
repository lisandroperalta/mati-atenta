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
  createCanvas(windowWidth, windowHeight, WEBGL);
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
  //background(0);
  rotateX(map(mouseY, 0, windowHeight, -0.5, 0.5));
  rotateY(map(mouseX, 0, windowWidth, -0.5, 0.5));
  translate(-windowWidth / 2, -windowHeight / 2);
  push();
  imageMode(CENTER);
  //var miFondo = get();
  //image(miFondo, windowWidth / 2, windowHeight / 2, windowWidth * escala, windowHeight * escala);
  //fill(0, 5);
  //rect(0, 0, width, height);
  pop();

  for (let i = 0; i < misPinceles.length; i++) {
    //misPinceles[i].mover();
    misPinceles[i].moverNoise();
    misPinceles[i].dibujar3d(i);
  }


  dibujarLinea();
  dibujarTexto();

}
////////////////////////objeto pincel


class Pincel {

  constructor() {

    this.x = random(0, windowWidth);
    this.y = random(0, windowHeight);
    this.velocidadHueR = random(0, 0.05)
    this.velocidadHueG = random(0, 0.05)
    this.velocidadHueB = random(0, 0.05)
    this.posZ = random(0.0, -1)
    this.destinoX = this.x;
    this.destinoY = this.y;
    this.posicionAnteriorX = this.x;
    this.posicionAnteriorY = this.y;
    this.frecuenciaAzar = random(60, 220);
    this.xoffset = random(10);
    this.velocidadOffset=random(0.001,0.0015);
    this.posicion = 0;
  }


  mover() {
    if (frameCount % this.frecuenciaAzar > 0 && frameCount % this.frecuenciaAzar < 1) {
      this.destinoX = this.x + random(-100, 100);
      this.destinoY = this.y + random(-20, 20);
    }



    this.x = lerp(this.posicionAnteriorX, this.destinoX, 0.01);
    this.posicionAnteriorX = this.x;


    this.y = lerp(this.posicionAnteriorY, this.destinoY, 0.01);
    this.posicionAnteriorY = this.y;

  }


  moverNoise() {




   // this.x = lerp(this.posicionAnteriorX, this.destinoX, 0.01);
   this.x += map (noise(this.xoffset),0,1,-0.5,0.5);
   
   this.xoffset +=this.velocidadOffset;




  }


  moverviejo() {


    this.posicionX = map(noise(this.xoffset), -100, 100);
    this.x += this.posicionX;
    this.xoffset += 0.01;

  }

  dibujar2d() {
    push();
    imageMode(CENTER);
    translate(this.x, this.y);
    image(this.miTextura, 0, 0, 125, 250);
    pop();
  }


  dibujar3d(i) {
    push();
    translate(0.5, 0.5)
    imageMode(CENTER);
    translate(this.x, this.y, this.posZ);
    texture(misTexturasPinceles[i]);
    noStroke();
    blendMode(ADD);
    plane(misTexturasPinceles[i].width, misTexturasPinceles[i].height);
    pop();
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