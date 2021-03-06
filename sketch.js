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
  miFuente = loadFont('assets/Always Lovely.TTF');
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
  ratioDeEscala = constrain(windowWidth / 1920, 0.3, 1.2);

  tamanioFuente = windowWidth / 20;
  button = createButton("play/pausa");
  button.position(20, 20);
  button.mousePressed(reproducir);
  for (let i = 0; i < 29; i++) {

    misPinceles[i] = new Pincel();
  }


  background(0);
  frameRate(24);
  smooth();
  //setAttributes('antialias', true);
  //setAttributes('depth', false);

  setAttributes('stencil', true);

  push();
  imageMode(CENTER);
  buffer1.tint(255, 255, 255, 255);
  buffer1.image(miDedo, -windowWidth / 2, -windowHeight / 2, windowWidth, windowHeight);
  pop();
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
    misPinceles[i].vivir();
    misPinceles[i].moverNoise();
    misPinceles[i].dibujar3d(i);
  }

  dibujarTexto3D();
  //dibujarTexto();

  buffer1.pop();



  //meto lo que hice en la imagen de salida para reusarla despues
  buffer2.push();
  buffer2.noStroke();

  let noiseTranslateX = map(noise(frameCount * 0.005 + 150), 0, 1, -5, 5);
  let noiseTranslateY = map(noise(frameCount * 0.005), 0, 1, -5, 5);
  let noiseScale = map(noise(frameCount * 0.005 + 750), 0, 1, 0.999, 1.01);

  buffer2.translate(noiseTranslateX, noiseTranslateY); //hago transformaciones

  buffer2.rotateZ(radians(rotationZ));
  buffer2.texture(buffer1); //meto la textura de salida
  buffer2.scale(noiseScale); //hago transformaciones
  if (mySound.currentTime() >= 131 && mySound.currentTime() <= 150){
    buffer2.scale(0.99); //hago transformaciones
  }
  if (mySound.currentTime() >= 131 && mySound.currentTime() <= 160){
  buffer2.rotate(radians(0.2));
}
 
 
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
    this.y = random(0 + margen * 2, windowHeight - margen * 2);
    this.posZ = random(0.0, -1)
    this.posicionAnteriorX = this.x;
    this.posicionAnteriorY = this.y;
    this.xoffset = random(10);
    this.yoffset = random(10);
    this.velocidadOffsetx = random(0.001, 0.0015);
    this.velocidadOffsety = random(0.001, 0.0015);
    this.posicion = 0;

    this.esperanzaDeVida = random(255, 765);
    this.vidaActual = 0;
    this.tintVida = 1;
  }

  vivir() {
    this.vidaActual += 1;

    if (this.vidaActual <= this.esperanzaDeVida) {

      this.tintVida++;

    }

    if (this.vidaActual >= this.esperanzaDeVida) {

      this.tintVida--;

    }
    if (this.tintVida <= 0) {

      this.reiniciarPincel()

    }


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
    buffer1.tint(255, this.tintVida);
    buffer1.texture(misTexturasPinceles[i]);
    buffer1.plane(misTexturasPinceles[i].width * ratioDeEscala, misTexturasPinceles[i].height * ratioDeEscala, 150, 150);
    if (this.x < 0 || this.x > windowWidth) {
      this.reiniciarPincel();

    }
    if (this.y < 0 || this.y > windowHeight) {
      this.reiniciarPincel();

    }

    buffer1.pop();
  }



}

//// dibujar dedo

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




/////////////////////////  dibujar texto


function dibujarTexto3D() {

  push();
  buffer1.stroke(255);
  //  buffer1.strokeWeight(5000);
  buffer1.textSize(ratioDeEscala * 100);
  buffer1.textAlign(CENTER);

  buffer1.textFont(miFuente);
  translate(0, 0);
  buffer1.textLeading(ratioDeEscala * 150);

  //buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 255);
  //buffer1.text(mySound.currentTime(), 100 + 5, windowHeight - 100 + 5);

  //buffer1.fill(sin(frameCount * 0.013) + 100 * 100, sin(frameCount * 0.03) + 25 * 100, sin(frameCount * 0.010) * 255);
  // buffer1.text(mySound.currentTime(), 100, windowHeight - 100);
  buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);

  //buffer1.text(frameCount, windowWidth / 2, windowHeight / 2);

  pop();

  if (mySound.currentTime() >= 0.01 && mySound.currentTime() <= 4) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("Nuevo ciclo \ny vos estas \natenta", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("Nuevo ciclo \ny vos estas \natenta", -windowWidth / 2, -100);
    pop();
  }


  if (mySound.currentTime() >= 5 && mySound.currentTime() <= 9) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("todo pasa en \ncualquier momento", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("todo pasa en \ncualquier momento", -windowWidth / 2, -100);
    pop();
  }


  if (mySound.currentTime() >= 9 && mySound.currentTime() <= 13) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("No quiero que \ncedamos el control", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("No quiero que \ncedamos el control", -windowWidth / 2, -100);
    pop();
  }

  if (mySound.currentTime() >= 13 && mySound.currentTime() <= 17) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("Si a cada paso \ndimos lo mejor", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("Si a cada paso \ndimos lo mejor", -windowWidth / 2, -100);
    pop();
  }

  if (mySound.currentTime() >= 17 && mySound.currentTime() <= 22) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("Vos tan zen \nestado de meditacion", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("Vos tan zen \nestado de meditacion", -windowWidth / 2, -100);
    pop();
  }

  if (mySound.currentTime() >= 22 && mySound.currentTime() <= 29) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("Yo en silencio \nescuchando tu voz", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("Yo en silencio \nescuchando tu voz", -windowWidth / 2, -100);
    pop();
  }

  if (mySound.currentTime() >= 31 && mySound.currentTime() <= 37) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("Yo en silencio \nescuchando tu voz", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("Yo en silencio \nescuchando tu voz", -windowWidth / 2, -100);
    pop();
  }


  if (mySound.currentTime() >= 59 && mySound.currentTime() <= 63) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("Bienvenidas \nlas murallas", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("Bienvenidas \nlas murallas", -windowWidth / 2, -100);
    pop();
  }

  if (mySound.currentTime() >= 64 && mySound.currentTime() <= 67) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("que vamos \na derribar", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("que vamos \na derribar", -windowWidth / 2, -100);
    pop();
  }

  if (mySound.currentTime() >= 68.5 && mySound.currentTime() <= 72) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("la gran flecha \nya avanza", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("la gran flecha \nya avanza", -windowWidth / 2, -100);
    pop();
  }


  if (mySound.currentTime() >= 73 && mySound.currentTime() <= 76) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("cruzando el \nhumedal", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("cruzando el \nhumedal", -windowWidth / 2, -100);
    pop();
  }

  if (mySound.currentTime() >= 78 && mySound.currentTime() <= 82) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("son tus ojos \nlos que marchan", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("son tus ojos \nlos que marchan", -windowWidth / 2, -100);
    pop();
  }

  if (mySound.currentTime() >= 82 && mySound.currentTime() <= 85) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("que se alejan \ndel lugar", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("que se alejan \ndel lugar", -windowWidth / 2, -100);
    pop();
  }

  if (mySound.currentTime() >= 86 && mySound.currentTime() <= 91) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("yo lamiendote \nlas llagas", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("yo lamiendote \nlas llagas", -windowWidth / 2, -100);
    pop();
  }

  if (mySound.currentTime() >= 92 && mySound.currentTime() <= 95) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("vos volviendote \na quemar", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("vos volviendote \na quemar", -windowWidth / 2, -100);
    pop();
  }

  if (mySound.currentTime() >= 113 && mySound.currentTime() <= 119) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("si sab??s que \nya no d??s m??s", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("si sab??s que \nya no d??s m??s", -windowWidth / 2, -100);
    pop();
  }

  if (mySound.currentTime() >= 121 && mySound.currentTime() <= 126) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("??Por qu?? no \nlo vas a intentar?", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("??Por qu?? no \nlo vas a intentar?", -windowWidth / 2, -100);
    pop();
  }

  if (mySound.currentTime() >= 128 && mySound.currentTime() <= 131) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("por lo menos hoy", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("por lo menos hoy", -windowWidth / 2, -100);
    pop();
  }



  if (mySound.currentTime() >= 132 && mySound.currentTime() <= 135) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("un poco de amor", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("un poco de amor", -windowWidth / 2, -100);
    pop();
  }


  if (mySound.currentTime() >= 136 && mySound.currentTime() <= 139) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("por lo mismo", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("por lo mismo", -windowWidth / 2, -100);
    pop();
  }

  if (mySound.currentTime() >= 141 && mySound.currentTime() <= 143) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("a los mismos", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("a los mismos", -windowWidth / 2, -100);
    pop();
  }

  if (mySound.currentTime() >= 145.5 && mySound.currentTime() <= 148.5) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("por lo mismo", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("por lo mismo", -windowWidth / 2, -100);
    pop();
  }

  if (mySound.currentTime() >= 150 && mySound.currentTime() <= 153) {
    push();
    buffer1.translate(windowWidth, windowHeight / 2)
    buffer1.textSize(ratioDeEscala * 150);
    buffer1.fill(sin(frameCount * 0.015) * 100, sin(frameCount * 0.02) * 100, sin(frameCount * 0.011) * 100);
    buffer1.text("a los mismos", -windowWidth / 2 + 5, -100 + 5);
    buffer1.fill(sin(frameCount * 0.015) * 255, sin(frameCount * 0.02) * 255, sin(frameCount * 0.011) * 255);
    buffer1.text("a los mismos", -windowWidth / 2, -100);
    pop();
  }

}





/////////// extras
function reproducir() {
  if (mySound.isPlaying()) {
    mySound.pause();
  } else {
    mySound.play();
    mySound.jump(127); //////////////////ATENTO A ESTO
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
  ratioDeEscala = constrain(windowWidth / 1920, 0.3, 1.2);

  push();
  imageMode(CENTER);
  buffer1.tint(255, 255, 255, 255);
  buffer1.image(miDedo, -windowWidth / 2, -windowHeight / 2, windowWidth, windowHeight);
  pop();

}