let buffer1, buffer2, buffer2D;

let mySound;
let tamanioFuente;
let button;
let miTextura;
let miDedo;


let miFuente;
let misPinceles = [];
let misTexturasPinceles = [];
let misTexturasGotitas = [];

let ratioDeEscala = 1;
let cargando = true;
let cantAssetsTotal = 32;
let cantAssetsCargados = 0;



let empezo = false;


/////////////////////////////////////// PRELOAD
function preload() {
  miFuente = loadFont('./assets/qanoar.personal-use.otf', cargueAsset);


}
////////////////////////////////SETUP
function setup() {
  // pixelDensity(1);



  mySound = loadSound('assets/atentaOGG.ogg', cargueAsset);
  // miFuente = loadFont('assets/qanoar.personal-use.otf', cargueAsset);
  miDedo = loadImage('assets/dedo.png', cargueAsset);
  miPlay = loadImage('assets/play.png', cargueAsset);


  for (let i = 0; i < 29; i++) {
    misTexturasPinceles[i] = loadImage('assets/' + i + '.png', cargueAsset);
  }

  for (let i = 1; i < 6; i++) {
    misTexturasGotitas[i] = loadImage('assets/gotita' + i + '.png', cargueAsset);
  }

  createCanvas(windowWidth, windowHeight);
  buffer1 = createGraphics(windowWidth, windowHeight, WEBGL);
  buffer2 = createGraphics(windowWidth, windowHeight, WEBGL);
  buffer2D = createGraphics(windowWidth, windowHeight);

  buffer1.setAttributes('alpha', true);
  buffer2.setAttributes('alpha', true);

  ratioDeEscala = constrain(windowWidth / 1920, 0.3, 1.2);

  tamanioFuente = windowWidth / 20;
  button = createButton("⏯");
  button.position(20, 20);
  button.mousePressed(reproducir);
  for (let i = 0; i < 29; i++) {

    misPinceles[i] = new Pincel();
  }
  background(0);
  frameRate(24);
   smooth();

  push();
  imageMode(CENTER);
  buffer1.tint(255, 255, 255, 255);
  buffer1.image(miDedo, -windowWidth / 2, -windowHeight / 2, windowWidth, windowHeight);
  pop();
}


/*DRAW******************************************************************* */
function draw() {
  if (cantAssetsCargados >= cantAssetsTotal) {

    cargando = false;
  }
  if (cargando == false) {
    buffer1.push();
    buffer1.noStroke(0);
    buffer1.translate(0, 0, 0);
    buffer1.texture(buffer2); // meto la textura de salida en la entrada
    buffer1.plane(windowWidth, windowHeight); // dibujo la textura de salida en la entrada  
    buffer1.translate(-windowWidth / 2, -windowHeight / 2); //CORRIJO TRANSLATE DE WEBGL
    dibujarDedo();

    if (mySound.currentTime() >= 17) {
      dibujoGotita(); ////////////////////////////////////////////////////////////////////
    }


    buffer1.noStroke();
    for (let i = 0; i < misPinceles.length; i++) {
      misPinceles[i].vivir();
      misPinceles[i].moverNoise();
      misPinceles[i].dibujar3d(i);
    }

    buffer2D.fill(255,255,255,255);
    dibujarTexto3D(); ///////////// HERE I DRAW THE TEXT

    buffer1.texture(buffer2D); // meto la textura de salida en la entrada
    buffer1.noStroke();
    buffer1.translate(windowWidth / 2, windowHeight / 2); //CORRIJO TRANSLATE DE WEBGL
    buffer1.plane(windowWidth, windowHeight, 100, 100); // dibujo la textura de salida en la entrada  
    buffer1.pop();
    

    if (empezo == false) {

      push();
      imageMode(CENTER);
      buffer1.tint(255, 150);
      let escalaPlay = ratioDeEscala * 250;
      buffer1.image(miPlay, 0 - escalaPlay / 2, 0 - escalaPlay / 2, escalaPlay, escalaPlay);
      pop();


    }

    //meto lo que hice en la imagen de salida para reusarla despues
    buffer2.push();
    buffer2.noStroke();

    let noiseTranslateX = map(noise(frameCount * 0.005 + 150), 0, 1, -5, 5);
    let noiseTranslateY = map(noise(frameCount * 0.005), 0, 1, -5, 5);
    let noiseScale = map(noise(frameCount * 0.005 + 750), 0, 1, 0.999, 1.01);

    push();
    buffer2.translate(noiseTranslateX, noiseTranslateY); //hago transformaciones
    buffer2.rotateZ(radians(rotationY / 25));
    let miTraslacion = map(rotationZ, 0, 360, -2, 2);
    buffer2.translate(miTraslacion, 0);;
    pop();


    ////////////////////////

    buffer2.texture(buffer1); //meto la textura de salida
    buffer2.scale(noiseScale); //hago transformaciones
    if (mySound.currentTime() >= 131 && mySound.currentTime() <= 150) {
      buffer2.scale(0.99); //hago transformaciones
    }
    if (mySound.currentTime() >= 131 && mySound.currentTime() <= 160) {
      buffer2.rotate(radians(0.2));
    }


    buffer2.plane(windowWidth, windowHeight); //dibujo la textura de salida
    buffer2.pop();

    image(buffer2, 0, 0, windowWidth, windowHeight);

    if (!focused) {
      mySound.pause();
    }

    ///fin del principal
  } else {
    //aca hago todo lo que se va amostrar mientras cargo
    background(0);
    fill(255);
    textSize(24);
    textAlign(CENTER);
    textFont(miFuente);

    text("Cargando " + cantAssetsCargados, width / 2, height / 2);

  }

  ////fin del draw
}


function cargueAsset() {
  cantAssetsCargados += 1;

}


function mouseClicked() {
  if (empezo == false) {
    let escalaPlay = ratioDeEscala * 250;
    print('   mouseX: ' + mouseX + '   mouseY: ' + mouseY)
    print(dist(windowWidth / 2, windowHeight / 2, mouseX, mouseY));
    print('escala play: ' + escalaPlay);
    if (dist(windowWidth / 2, windowHeight / 2, mouseX, mouseY) < escalaPlay) {


      reproducir();
      empezo = true;
    }

  }
}





// dibujogotita

function dibujoGotita() {
  buffer1.push();
  if (random() < 0.25) {
    buffer1.tint(random(150, 255), random(150, 255), random(150, 255));

    let pincel = int(random(1, 6));


    buffer1.translate(random(windowWidth), random(windowHeight));
    buffer1.texture(misTexturasGotitas[pincel]);
    buffer1.plane(misTexturasGotitas[pincel].width * ratioDeEscala, misTexturasGotitas[pincel].height * ratioDeEscala, 150, 150);
  }
  buffer1.pop();

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






function dibujarTexto3D() {
  let miColorFront = color(230, 200, 90,255);
  let miColorBack = color(sin(frameCount * 0.015) * 200 + 55, sin(frameCount * 0.02) * 200 + 55, sin(frameCount * 0.011) * 200 + 55,255);
  let miEscala = ratioDeEscala * 100;
  let disTanciaSombra = 2.5;
  push();
  buffer1.tint(255);

  buffer2D.clear();
  buffer2D.noStroke();
  buffer2D.textSize(miEscala);
  buffer2D.textAlign(CENTER);
  buffer2D.textFont(miFuente);
  buffer2D.textLeading(ratioDeEscala * 250);
  

  if (mySound.currentTime() >= 0.01 && mySound.currentTime() <= 4) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("Nuevo ciclo y \nvos estás atenta", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("Nuevo ciclo y \nvos estás atenta", windowWidth / 2, windowHeight / 2);
    pop();

  }


  if (mySound.currentTime() >= 5 && mySound.currentTime() <= 9) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("todo pasa en \ncualquier momento", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("todo pasa en \ncualquier momento", windowWidth / 2, windowHeight / 2);
    pop();
  }


  if (mySound.currentTime() >= 9 && mySound.currentTime() <= 13) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("No quiero que \ncedamos el control", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("No quiero que \ncedamos el control", windowWidth / 2, windowHeight / 2);
    pop();
  }

  if (mySound.currentTime() >= 13 && mySound.currentTime() <= 17) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("Si a cada paso \ndimos lo mejor", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("Si a cada paso \ndimos lo mejor", windowWidth / 2, windowHeight / 2);
    pop();
  }

  if (mySound.currentTime() >= 17 && mySound.currentTime() <= 22) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("Vos tan zen \nestado de meditacion", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("Vos tan zen \nestado de meditacion", windowWidth / 2, windowHeight / 2);
    pop();
  }

  if (mySound.currentTime() >= 22 && mySound.currentTime() <= 29) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("Yo en silencio \nescuchando tu voz", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("Yo en silencio \nescuchando tu voz", windowWidth / 2, windowHeight / 2);
    pop();
  }

  if (mySound.currentTime() >= 31 && mySound.currentTime() <= 37) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("Yo en silencio \nescuchando tu voz", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("Yo en silencio \nescuchando tu voz", windowWidth / 2, windowHeight / 2);
    pop();
  }


  if (mySound.currentTime() >= 59 && mySound.currentTime() <= 63) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("Bienvenidas \nlas murallas", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("Bienvenidas \nlas murallas", windowWidth / 2, windowHeight / 2);
    pop();
  }

  if (mySound.currentTime() >= 64 && mySound.currentTime() <= 67) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("que vamos \na derribar", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("que vamos \na derribar", windowWidth / 2, windowHeight / 2);
    pop();
  }

  if (mySound.currentTime() >= 68.5 && mySound.currentTime() <= 72) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("la gran flecha \nya avanza", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("la gran flecha \nya avanza", windowWidth / 2, windowHeight / 2);
    pop();
  }


  if (mySound.currentTime() >= 73 && mySound.currentTime() <= 76) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("cruzando el \nhumedal", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("cruzando el \nhumedal", windowWidth / 2, windowHeight / 2);
    pop();
  }

  if (mySound.currentTime() >= 78 && mySound.currentTime() <= 82) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("son tus ojos \nlos que marchan", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("son tus ojos \nlos que marchan", windowWidth / 2, windowHeight / 2);
    pop();
  }

  if (mySound.currentTime() >= 82 && mySound.currentTime() <= 85) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("que se alejan \ndel lugar", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("que se alejan \ndel lugar", windowWidth / 2, windowHeight / 2);
    pop();
  }

  if (mySound.currentTime() >= 86 && mySound.currentTime() <= 91) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("yo lamiendote \nlas llagas", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("yo lamiendote \nlas llagas", windowWidth / 2, windowHeight / 2);
    pop();
  }

  if (mySound.currentTime() >= 92 && mySound.currentTime() <= 95) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("vos volviendote \na quemar", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("vos volviendote \na quemar", windowWidth / 2, windowHeight / 2);
    pop();
  }

  if (mySound.currentTime() >= 113 && mySound.currentTime() <= 119) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("si sabés que \nya no dás más", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("si sabés que \nya no dás más", windowWidth / 2, windowHeight / 2);
    pop();
  }

  if (mySound.currentTime() >= 121 && mySound.currentTime() <= 126) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("¿Por qué no \nlo vas a intentar?", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    textStyle(NORMAL);
    buffer2D.text("¿Por qué no \nlo vas a intentar?", windowWidth / 2, windowHeight / 2);
    pop();
  }

  if (mySound.currentTime() >= 128 && mySound.currentTime() <= 131) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("por lo menos hoy", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("por lo menos hoy", windowWidth / 2, windowHeight / 2);
    pop();
  }



  if (mySound.currentTime() >= 132 && mySound.currentTime() <= 135) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("un poco de amor", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("un poco de amor", windowWidth / 2, windowHeight / 2);
    pop();
  }


  if (mySound.currentTime() >= 136 && mySound.currentTime() <= 139) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("por lo mismo", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("por lo mismo", windowWidth / 2, windowHeight / 2);
    pop();
  }

  if (mySound.currentTime() >= 141 && mySound.currentTime() <= 143) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("a los mismos", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("a los mismos", windowWidth / 2, windowHeight / 2);
    pop();
  }

  if (mySound.currentTime() >= 145.5 && mySound.currentTime() <= 148.5) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("por lo mismo", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("por lo mismo", windowWidth / 2, windowHeight / 2);
    pop();
  }

  if (mySound.currentTime() >= 150 && mySound.currentTime() <= 153) {
    push();
    buffer2D.textSize(miEscala);
    buffer2D.fill(miColorBack);
    textStyle(BOLD);
    buffer2D.text("a los mismos", windowWidth / 2 + disTanciaSombra, windowHeight / 2 + disTanciaSombra);
    buffer2D.fill(miColorFront);
    buffer2D.text("a los mismos", windowWidth / 2, windowHeight / 2);
    pop();
  }
  pop();
}





/////////// extras
function reproducir() {
  print('reproucir');
  if (mySound.isPlaying()) {
    mySound.pause();
  } else {
    mySound.play();
    //mySound.jump(127); //////////////////ATENTO A ESTO
  }

  //
  background(0);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buffer1.resizeCanvas(windowWidth, windowHeight);
  buffer2.resizeCanvas(windowWidth, windowHeight);
  buffer2D.resizeCanvas(windowWidth, windowHeight);

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