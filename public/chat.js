const socket = io()
let user

window.onload = () => {
    Swal.fire({
        title: 'Bienvenido',
        text: 'Ingrese su nombre',
        input: 'text',
        inputValidator: (value) => {
            return !value && 'Ingrese un nombre'
        },
        allowOutsideClick: false,
        confirmButtonText: 'Ingresar'
    }).then(result => {
        user = result.value
        if (user) socket.emit('newUser', user)
    })
}

const chatbox = document.getElementById('chatbox')
const log = document.getElementById('log')

chatbox.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        socket.emit('messageLogs', { user, message: chatbox.value })
        chatbox.value = ''
    }
})

socket.on('messageLogs', data => {
    console.log('Mensajes recibidos en el cliente:', data);
    // Limpiar el contenido del div de registro (log)
    log.innerHTML = ''
    
    // Iterar sobre todos los mensajes recibidos y agregarlos al div de registro
    data.forEach(message => {
        console.log('mensaje enviado al dom', message)
        const messageElement = document.createElement('div')
        messageElement.classList.add('alert', 'alert-primary', 'mb-2')
        messageElement.innerHTML = `<strong>${message.user}:</strong> ${message.message}`
        log.appendChild(messageElement)
    })
})

socket.on('error', (error) =>
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Ha ocurrido un error'
    })
)