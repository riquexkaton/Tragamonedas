class slot {
    constructor(index) {
        this.number = 0;
        this.points = 0;
        this.slot = [
            { img: "https://i.pinimg.com/564x/1e/00/d6/1e00d64d49ca64e3c107187579542ddf.jpg", id: 1 },
            { img: "https://i.pinimg.com/564x/48/27/42/482742c3061d4d7527ebbdd1418252f6.jpg", id: 2 },
            { img: "https://i.pinimg.com/736x/82/cf/82/82cf82f6e60a0e8b09de8e3da8091b3f.jpg", id: 3 },
            { img: "https://i.pinimg.com/564x/82/8e/fa/828efa5498d958587f70716c361ea951.jpg", id: 4 }
        ];
        this.index = index;
        this.slots = gsap.utils.toArray("img");
        this.slotsBlur = gsap.utils.toArray(".blur");
    }
    //
    start() {

        return () => {
            const imagenes = document.querySelectorAll("img");
            let numeroAleatorio = this.generarNumeroAleatorio();
            imagenes[this.index].src = this.slot[numeroAleatorio].img;
            this.slotMachineEffect();
            this.positionInitial();
            this.number = numeroAleatorio;
            this.points = numeroAleatorio;
            this.number = 0;
        }

    }


    stop() {


        clearInterval(this.start);
        this.positionInitial();


    }

    generarNumeroAleatorio() {
        return Math.floor(Math.random() * this.slot.length);
    }

    slotMachineEffect() {

        let tl = gsap.timeline();

        tl.to(this.slots[this.index], {
            yPercent: 400
        });
    }

    positionInitial() {
        let tl = gsap.timeline();

        tl.to(this.slots[this.index], {
            yPercent: -5
        })
            .to(this.slots[this.index], {
                yPercent: 0,
            })
    }

    blurOpacity(boolean) {
        gsap.to(this.slotsBlur[this.index], {
            opacity: boolean ? 1 : 0,
            duration: 1.5
        });
    }



}


//variables globales
const button = document.querySelector(".iniciar");
const button2 = document.querySelector(".stop");
const slot1 = new slot(0);
const slot2 = new slot(1);
const slot3 = new slot(2);
var timer = [];
var slotArr = [];

//puntuaje
const pointNumbers = document.querySelector(".points h3");
let cost = 50;
let apuesta = 1;
let globalPoints = 0;

//SFX
const auidioPlay = document.querySelector(".play");
const audioStop = document.querySelector(".stopMusic");
const backgroundMusic = document.querySelector(".background-music");
const slotStop = document.querySelector(".reject");

const openMenu = document.querySelector(".open-menu");

//eventos:


//boton para iniciar la maquina
button.addEventListener("click", () => {

    if (globalPoints - (cost * apuesta) < 0) {
        alert("no tienes dinero");
    }
    else {
        timer = [];
        slotArr = [];
        button.disabled = true;
        button2.disabled = false;
        auidioPlay.play();
        backgroundMusic.currentTime = 10;
        backgroundMusic.play();
        backgroundMusic.volume = 0.6;
        openMenu.disabled = true;
        globalPoints -= (cost * apuesta);
        pointNumbers.textContent = globalPoints < 0 ? 0 : globalPoints;

        gsap.to(".menu", {
            x: "100%",
            ease: "elastic",
            duration: 1.2
        });
        gsap.to("body", {
            marginLeft: 0,
            ease: "elastic",
            duration: 1.2
        });

        for (let i = 0; i < 3; i++) {
            slotArr.push(new slot(i));
        };

        slotArr.forEach((item, i) => {
            timer.push(setInterval(item.start(), 100));
            item.blurOpacity(true);
        });
    }

});



function detener(time, interval, res) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            clearInterval(interval);
            slotStop.play();
            slotStop.currentTime = 0;
            resolve(res.blurOpacity(false));
        }, time)
    })
}

function cambiarAnimacion(j) {
    const img = document.querySelector(".notification .img");
    img.innerHTML = "";
    lottie.loadAnimation({
        container: document.querySelector(".notification .img"),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: j
    });
}

function notificationVisible(message) {
    const msj = document.querySelector(".notification p");
    msj.textContent = message;
    gsap.to(".notification", {
        opacity: 1
    });
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            gsap.to(".notification", {
                opacity: 0,
                duration: 1.5
            });
            resolve("success");
        }, 2000)
    })
}

function delayOperation(callback, time) {
    return new Promise((resolve, rejetc) => {
        setTimeout(() => {
            resolve(callback());
        }, time);
    });
}
//boton para detener la maquina
button2.addEventListener("click", async () => {

    audioStop.play();
    let puntuaje = [];
    let promises = [];
    button2.disabled = true;


    slotArr.forEach((item, i) => {
        const numRandom = Math.floor(Math.random() * (3000 - 500) + 500);
        promises.push(detener(numRandom, timer[i], item));
    });

    await Promise.all(promises);

    slotArr.forEach((item) => {
        puntuaje.push(item.points);
    });
    calcularPuntos(puntuaje);
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    await delayOperation(() => {
        button.disabled = false;
    }, 1000);
    openMenu.disabled = false;
});


//funcion para el calculo del puntuaje
async function calcularPuntos(arr) {
    const puntuaje = [
        { patron: "000", points: 200 },
        { patron: "111", points: 150 },
        { patron: "222", points: 120 },
        { patron: "333", points: -150 },
        { patron: "00", points: 100 },
        { patron: "11", points: 50 },
        { patron: "22", points: 20 },
        { patron: "33", points: -50 }
    ];

    let result = null;
    let arrString = arr.join("");


    arr.forEach((item, i) => {


        const RegPoints = new RegExp(item, "g");
        if (arrString.match(RegPoints).length >= 2) {
            result = {
                number: item,
                length: arrString.match(RegPoints).length
            }
        }

    });

    for (let i = 0; i <= puntuaje.length - 1; i++) {

        try {
            const check = `${result.number}`.repeat(result.length);
            if (puntuaje[i].patron == check) {

                switch (puntuaje[i].points >= 0) {
                    case true:
                        globalPoints += (puntuaje[i].points * apuesta);
                        cambiarAnimacion("win.json");
                        await notificationVisible(`Ha ganado ${puntuaje[i].points*apuesta}pts`);
                        break;
                    case false:
                        globalPoints += (puntuaje[i].points * apuesta);
                        cambiarAnimacion("fail.json");
                        await notificationVisible(`Ha perdido ${puntuaje[i].points*apuesta}pts`);
                        break;
                }
                break;
            }

        }
        catch (err) {
            globalPoints -= (10 * apuesta);
            cambiarAnimacion("fail.json");
            await notificationVisible(`Ha perdido ${10*apuesta}pts`);
            break;
        }

    }

    pointNumbers.textContent = globalPoints < 0 ? 0 : globalPoints;

}


//formulario para recibir los datos del usuario
const ButtonStartGame = document.querySelector("form");

ButtonStartGame.addEventListener("submit", (e) => {
    e.preventDefault();
    const setName = document.querySelector(".name").value;
    const userName = document.querySelector(".profile h3");
    const initialCoins = document.querySelector(".coins-initial").value;

    if (setName === "" || initialCoins < 500 || initialCoins > 1000) {
        alert("No puede dejar los campos vacios y su entrada debe ser de 100 como minimo y maximo de 1000");
    }
    else {
        gsap.to(".hola", {
            opacity: 0,
            pointerEvents: "none"
        });

        userName.textContent = setName.length >= 12 ? setName.substring(0, 12) + "..." : setName;
        globalPoints += parseInt(initialCoins, 10);
        pointNumbers.textContent = globalPoints;
    }


});

//sonido al escribir en el teclado
document.addEventListener("keydown", () => {
    const keySound = document.querySelector(".keysound");
    keySound.currentTime = 0;
    keySound.play();
});


//menu
openMenu.addEventListener("click", () => {
    gsap.to(".menu", {
        x: 0,
        marginRight: -300,
        ease: "elastic",
        duration: 1.2
    });
    gsap.to("body", {
        marginLeft: -300,
        ease: "elastic",
        duration: 1.2
    });
});
const closeMenu = document.querySelector(".close-menu");
closeMenu.addEventListener("click", () => {
    gsap.to(".menu", {
        x: "100%",
        ease: "elastic",
        duration: 1.2
    });
    gsap.to("body", {
        marginLeft: 0,
        ease: "elastic",
        duration: 1.2
    });
});

//apuestas
const apuestas = document.querySelectorAll(".apuesta");

apuestas.forEach((item, i) => {

    item.addEventListener("click", () => {
        apuesta = i + 1;
        apuestas.forEach(item => {
            item.classList.remove("select")
        });
        item.classList.add("select");
    });
});

//retirarse
const leave = document.querySelector(".leave");
leave.addEventListener("click", () => {

    apuestas.forEach(item => {
        item.classList.remove("select")
    });
    globalPoints = 0;
    apuesta = 1;
    apuestas[0].classList.add("select");

    let tl = gsap.timeline();
    tl.to(".menu", {
        x: "100%",
        ease: "elastic",
        duration: 1.2
    })
        .to("body", {
            marginLeft: 0,
            ease: "elastic",
            duration: 1.2
        }, "-=1")
        .to(".hola", {
            opacity: 1,
            pointerEvents: "visible"
        }, "-=1");
});

