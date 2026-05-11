const readline = require("readline")
const fs = require("fs");
const agenda = require("./agenda.json");
const { DateTime } = require("luxon");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const offset = DateTime.now().offset / 60;
const signo = offset >= 0 ? "+" : "-";
const horas = String(Math.abs(offset)).padStart(2, "0");
let zonaHoraria = `${signo}${horas}:00`;

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
                menu();
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
    menu();
}

function verEventosHoy() {
    const eventosHoy = agenda.filter(evento => {
        const fechaEvento = DateTime.fromISO(evento.fecha);
        return fechaEvento.hasSame(DateTime.now(), 'day');
    });
    
    let eventosHoyFormateado = [];

    for (let cadaEvento of eventosHoy) {
        const fechaInicio = DateTime.fromISO(cadaEvento.fecha);
        const fechaFin = fechaInicio.plus({ minutes: cadaEvento.duracion });
        const eventoFormateado = `
Título: ${cadaEvento.titulo}
Fecha de inicio: ${cadaEvento.fecha}
Fecha de fin: ${fechaFin.toISO()}
`;
        eventosHoyFormateado.push(eventoFormateado);
    }
    if (eventosHoyFormateado.length <= 0) {
        console.log("No hay eventos planeados para esta fecha\n")
    } else {
        eventosHoyFormateado.sort()
        for (let cadaEvento of eventosHoyFormateado) {
            console.log(cadaEvento);
        }
    }
    menu();
};

async function buscarEventos() {
    let año = await new Promise(resolve => rl.question("Introduce el año\n", resolve));
    let mes = await new Promise(resolve => rl.question("Introduce el mes\n", resolve));
    let dia = await new Promise(resolve => rl.question("Introduce el día\n", resolve));

    const fechaBuscada = DateTime.fromObject({ year: parseInt(año), month: parseInt(mes), day: parseInt(dia) });

    const eventosFecha = agenda.filter(evento => {
        const fechaEvento = DateTime.fromISO(evento.fecha);
        return fechaEvento.hasSame(fechaBuscada, 'day');
    });
    
    let eventosFechaFormateado = [];

    for (let cadaEvento of eventosFecha) {
        const fechaInicio = DateTime.fromISO(cadaEvento.fecha);
        const fechaFin = fechaInicio.plus({ minutes: cadaEvento.duracion });
        const eventoFormateado = `
Título: ${cadaEvento.titulo}
Fecha de inicio: ${cadaEvento.fecha}
Fecha de fin: ${fechaFin.toISO()}
`;
        eventosFechaFormateado.push(eventoFormateado);
    }
    if (eventosFechaFormateado.length <= 0) {
        console.log("No hay eventos planeados para esta fecha\n")
    } else {
        eventosFechaFormateado.sort()
        for (let cadaEvento of eventosFechaFormateado) {
            console.log(cadaEvento);
        }
    }
    menu();
};

async function borrarEvento() {
    if (agenda.length === 0) {
        console.log("No hay eventos creados\n");
        menu();
        return;
    }

    let eventosFormateado = [];
    let i = 1;

    for (let cadaEvento of agenda) {
        const fechaInicio = DateTime.fromISO(cadaEvento.fecha);
        const fechaFin = fechaInicio.plus({ minutes: cadaEvento.duracion });
        const eventoFormateado = `
${i}.   Título: ${cadaEvento.titulo}
        Fecha de inicio: ${cadaEvento.fecha}
        Fecha de fin: ${fechaFin.toISO()}
`;
        eventosFormateado.push(eventoFormateado);
        i++;
    }

    for (let cadaEvento of eventosFormateado) {
        console.log(cadaEvento);
    }

    let numero = await new Promise(resolve => rl.question("¿Cuál quieres borrar? (número)\n", resolve));
    let index = parseInt(numero) - 1;

    if (index >= 0 && index < agenda.length) {
        agenda.splice(index, 1);
        fs.writeFileSync("./agenda.json", JSON.stringify(agenda, null, 2));
        console.log("Evento borrado correctamente\n");
    } else {
        console.log("Número inválido");
    }

    menu();
}