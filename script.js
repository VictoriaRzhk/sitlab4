const area = document.querySelector('.area')
const btn = document.querySelector('.btn')

let isAction = false
let notes = []
let selectedNoteIndex = null

window.onload = (() => {
    let loadNotes = localStorage.getItem('notes')

    if (loadNotes) {
        notes = JSON.parse(loadNotes)
        notesRenderer(notes)
    }
})

let noteSize = {
    width: 0,
    height: 0,
}

let areaSize = {
    width: area.offsetWidth,
    height: area.offsetHeight,
}

let startCoords = {
    x: 0,
    y: 0,
}

let currentCoords = {
    x: 0,
    y: 0,
}

// saving notes to localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes))
}

function refreshNotesText(notes) {
    for (let i = 0; i < notes.length; i++) {
        console.log(document.querySelector('.note[data-index="' + i + '"]'))
        notes[i].text = document.querySelector('.note[data-index="' + i + '"] textarea').value
    }
}

function notesRenderer(notes) {
    let template = ''

    for (let i = 0; i < notes.length; i++) {
        const note = notes[i]
        template += `<div class="note" 
        data-index="${i}" 
        style="left: ${note.x}px; top: ${note.y}px;">
        <h1>${i}</h1>
        <textarea>${notes[i].text}</textarea>
        </div>`
    }

    area.innerHTML = template
}

function moveNote(coords, noteIndex) {
    const selectedNote = document.querySelector('.note[data-index="' + noteIndex + '"]')
    selectedNote.style.left = coords.x + "px"
    selectedNote.style.top = coords.y + "px"
}

btn.addEventListener('click', () => {
    refreshNotesText(notes)

    const note = {
        x: 0,
        y: 0,
        text: ''
    }
    notes.push(note)
    notesRenderer(notes)
    saveNotes() // refreshing notes value in the localStorage
})

area.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('note')) {
        isAction = true
        selectedNoteIndex = e.target.getAttribute('data-index')

        noteSize = {
            width: document.querySelector('.note[data-index="' + selectedNoteIndex + '"]').offsetWidth,
            height: document.querySelector('.note[data-index="' + selectedNoteIndex + '"]').offsetHeight,
        }

        startCoords.x = e.pageX
        startCoords.y = e.pageY
    }
})

area.addEventListener('mouseup', (e) => {
    if (isAction) {
        isAction = false
        notes[selectedNoteIndex].x = currentCoords.x
        notes[selectedNoteIndex].y = currentCoords.y
        saveNotes() // refreshing notes value in the localStorage
    }
})

area.addEventListener('mousemove', (e) => {
    if (isAction) {
        currentCoords = {
            x: notes[selectedNoteIndex].x + e.pageX - startCoords.x,
            y: notes[selectedNoteIndex].y + e.pageY - startCoords.y,
        }

        if (currentCoords.x <= 0) currentCoords.x = 0
        if (currentCoords.x >= (areaSize.width - noteSize.width)) currentCoords.x = areaSize.width - noteSize.width

        if (currentCoords.y <= 0) currentCoords.y = 0
        if (currentCoords.y >= (areaSize.height - noteSize.height)) currentCoords.y = areaSize.height - noteSize.height

        moveNote(currentCoords, selectedNoteIndex)
    }
})