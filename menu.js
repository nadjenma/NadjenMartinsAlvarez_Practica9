const readline = require("readline")
const luxon = require("luxon")
const fs = require("fs");
const agenda = require("./agenda.json");
const { DateTime } = require("luxon");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let zonaHoraria = (DateTime.now().offset / 60) < 10 ? `+0${DateTime.now().offset / 60}:00` : `+${DateTime.now().offset / 60}:00`;


console.log(zonaHoraria);
menu();

async function menu() {
    rl.question("Elige una opción: \n1.Nuevo evento\n2.Ver eventos de hoy\n3.Buscar eventos para una fecha\n4.Borrar evento\n5.Salir\n", (input) => {
        switch (parseInt(input)) {
            case 1:
                nuevoEvento();
            case 2:
                verEventosHoy();
            case 3:
                buscarEventos();
            case 4:
                borrarEvento();
            case 5:
                process.exit()
            default:
                console.log("Opción inválida");
        };
    });
};

async function nuevoEvento() {
    DateTime.now().zone;
    let resultado = {
        "fecha": `${año}-${mes}-${dia}T${hora}:${minuto}:00.000${zonaHoraria}`,
        "titulo": titulo,
        "duracion": parseInt(duracion)
    }
    rl.question("Introduce el año\n", (input) => {
        let año = input;
    });
    rl.question("Introduce el mes\n", (input) => {
        let mes = input;
    });
    rl.question("Introduce el día\n", (input) => {
        let dia = input;
    });
    rl.question("Introduce la hora\n", (input) => {
        let hora = input;
    });
    rl.question("Introduce el minuto\n", (input) => {
        let minuto = input;
    });
    rl.question("Introduce el título\n", (input) => {
        let titulo = input;
    });
    rl.question("Introduce la duración\n", (input) => {
        let duracion = input;
    });
    agenda.push(resultado);
}

async function verEventosHoy() {

}

async function buscarEventos() {

}
