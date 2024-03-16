const { axiosInstance } = require("./axios");
const { signInPage } = require("../helpers/processMessage");
const _ = require('lodash');


function sendMessage(messageObj, messageText) {
    return axiosInstance.get("sendMessage", {
        chat_id: messageObj.chat.id,
        text: messageText
    })
}


async function handleMessage(messageObj) {
    console.log(messageObj);
    
    const messageText = messageObj && messageObj.text ? messageObj.text : "";



    if (messageText.charAt(0) === "/") {
        const command = messageText.substr(1)

        switch (command) {
            case "start":
                sendMessage(messageObj, "Hola!, soy el bot de prueba")
                break;

            case "ayuda":
                sendMessage(messageObj, "Formatos de mensajes:\n**Para Modalidad**\nMODALIDAD Expediente:[EXPEDIENTE] Modalidad:[MODALIDAD]\n\n**Para Cope**\nCOPE Expediente:[EXPEDIENTE] Cope:[COPE]\n\n**Para Modalidad y Cope**\nAMBOS Expediente:[EXPEDIENTE] Ambos:[COPE],[MODALIDAD]\n\n**Para Zonificar**\nZONIFICAR Expediente:[EXPEDIENTE] Zonas:[ZONAS] Prioridad:[PRIORIDAD](Solamente en fijo)")
                break;

            default:
                // Send message for unknown command
                return sendMessage(messageObj, "Disculpa no me se ese comando 😔")

        }
    } else {
        const tarea = extraerTarea(messageText);
        console.log(tarea.validMessage);

        if (tarea.validMessage === false) {
            return sendMessage(messageObj, "No se pudo completar la accion o no escribio bien un comando");
        }

        if (messageText != "") {
            const action = await signInPage(tarea);
            //Check if action true or false
            console.log(action);
            if (action === true) {
                return sendMessage(messageObj, "Se completo la accion");
            }

            return sendMessage(messageObj, "No se pudo completar la accion o no escribio bien un comando");

        }



        return sendMessage(messageObj, messageText);
    }
}



const extraerTarea = (message) => {
    let messageTemp = message
    let expediente = '';
    let opcion = '';
    let prioridad = null;
    let validMessage = true;

    const match = messageTemp.match(/Prioridad:(\d+)/);
    if (match && match[1]) {
        prioridad = match[1];

        messageTemp = messageTemp.replace(match[0], '');

    } else {
        console.log('No se encontró la prioridad.');
    }

    //Extrae el expedinete
    if (message.includes('Modalidad:')) {
        expediente = _.split(message, 'Expediente:')[1].split(' Modalidad:')[0];
    } else if (message.includes('Cope:')) {
        expediente = _.split(message, 'Expediente:')[1].split(' Cope:')[0];
    } else if (message.includes('Ambos:')) {
        expediente = _.split(message, 'Expediente:')[1].split(' Ambos:')[0];
    } else if (message.includes('Zonas:')) {
        expediente = _.split(message, 'Expediente:')[1].split(' Zonas:')[0];
    };
    //EXtrae el cope o la madalidad
    //ERROR AROUND HERE
    let tarea = _.split(message, ' Expediente:')[0];

    // console.log('Extraido Tarea: ' + tarea);
    if (tarea === 'COPE') {

        const cop = _.split(message, 'Cope:')[1].toUpperCase();
        opcion = `CT ${cop}`

        return {
            tarea,
            expediente,
            opcion,
            prioridad
        }
    } else if (tarea === 'MODALIDAD') {
        opcion = _.split(message, 'Modalidad:')[1]

        return {
            tarea,
            expediente,
            opcion,
            prioridad
        }
    } else if (tarea === 'AMBOS') {
        opcion = _.split(message, 'Ambos:')[1].toUpperCase();
        return {
            tarea,
            expediente,
            opcion,
            prioridad
        }
    } else if (tarea === 'ZONIFICAR') {


        opcion = _.split(messageTemp, 'Zonas:')[1];

        if (opcion.toLowerCase().trim() === 'seleccionar todo' || opcion.toLowerCase().trim() === 'deseleccionar todo') {

            return {
                tarea,
                expediente,
                opcion,
                prioridad
            }
        } else {
            opcion = opcion.split(',');

            opcion = opcion.map(numero => {
                const numeroEntero = parseInt(numero, 10);
                return numeroEntero < 10 ? `0${numeroEntero}` : `${numeroEntero}`;
            });
            return {
                tarea,
                expediente,
                opcion,
                prioridad
            }

        }


    }
    validMessage = false;
    return { validMessage }

}

module.exports = {
    handleMessage,
    sendMessage
}
