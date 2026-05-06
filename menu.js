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

function verificarConflicto(nuevaFecha, duracionNueva) {
    const inicio = DateTime.fromISO(nuevaFecha);
    const fin = inicio.plus({ minutes: duracionNueva });

    return agenda.some(evento => {
        const inicioExistente = DateTime.fromISO(evento.fecha);
        const finExistente = inicioExistente.plus({ minutes: evento.duracion });

        return fin > inicioExistente && inicio < finExistente;
    });
}

menu();

function menu() {
    rl.question("Elige una opción: \n1.Nuevo evento\n2.Ver eventos de hoy\n3.Buscar eventos para una fecha\n4.Borrar evento\n5.Salir\n", (input) => {
        switch (parseInt(input)) {
            case 1:
                nuevoEvento();
                break;
            case 2:
                verEventosHoy();
                break;
            case 3:
                buscarEventos();
                break;
            case 4:
                borrarEvento();
                break;
            case 5:
                process.exit();
                break;
            default:
                console.log("Opción inválida");
                break;
        };
    });
};

async function nuevoEvento() {
    let año = await new Promise(resolve => rl.question("Introduce el año\n", resolve));
    let mes = await new Promise(resolve => rl.question("Introduce el mes\n", resolve));
    let dia = await new Promise(resolve => rl.question("Introduce el día\n", resolve));
    let hora = await new Promise(resolve => rl.question("Introduce la hora\n", resolve));
    let minuto = await new Promise(resolve => rl.question("Introduce el minuto\n", resolve));
    let titulo = await new Promise(resolve => rl.question("Introduce el título\n", resolve));
    let duracion = await new Promise(resolve => rl.question("Introduce la duración\n", resolve));

    let resultado = {
        "fecha": `${año}-${mes}-${dia}T${hora}:${minuto}:00.000${zonaHoraria}`,
        "titulo": titulo,
        "duracion": parseInt(duracion)
    }

    if (verificarConflicto(resultado.fecha, resultado.duracion)) {
        console.log("Ya hay un evento programado en ese horario");
        menu();
        return;
    }

    agenda.push(resultado);
    fs.writeFileSync("./agenda.json", JSON.stringify(agenda, null, 2));
    console.log("Evento añadido correctamente");
}

function verEventosHoy() {
    let ordenado = [];
    for (let cadaEvento of agenda) {
        
    }
}