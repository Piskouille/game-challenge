import { utils } from "./utils.js"
import { startGame } from "./game.js"


const gameAudios = { 
    'audioSelect': {url: '../sounds/selection-map.mp3', audio: null},
    'audioGo': {url: '../sounds/go.mp3', audio: null},
    'audioStart' : {url: '../sounds/start.mp3', audio: null},
    'audioWin' : {url: '../sounds/win.mp3', audio: null},
    'audioLoose' : {url: '../sounds/loose.mp3', audio: null},
    'audioBackground' : {url: '../sounds/background.mp3', audio: null},
    'audioPunch' : {url: '../sounds/punch.mp3', audio: null},
}

Promise
    .all(Object.values(gameAudios).map(v => utils.audioLoader(v)))
    .then(mainFunction(gameAudios))
    .catch(error => console.log('Cannot load game audios ...'))



function mainFunction(gameAudios){
    if(window.location.pathname ===  "/index.html"){
        const maps = document.querySelectorAll('.maps-thumbnails img')
        const start = document.getElementById('startGame')
    
        gameAudios.audioSelect.audio.volume = gameAudios.audioGo.audio.volume = .1
    
        sessionStorage.clear()
    
        maps.forEach(map => {
            map.addEventListener('click', () => {
                const selected = document.querySelector('img.selected')
                
                gameAudios.audioSelect.audio.currentTime = 0
                gameAudios.audioSelect.audio.play()
    
                selected.classList.remove('selected')
                map.classList.add('selected')
                sessionStorage.setItem("battleField", map.src)
            })
        })
    
        start.addEventListener('click', () => {
            gameAudios.audioGo.audio.play()
            setTimeout(() => window.location.href = "/game.html", 1000)
        })
    }
    
    if(window.location.pathname ===  "/game.html"){
        window.addEventListener('load', () => {
            const game = document.querySelector("#game")
    
            if(sessionStorage.getItem("battleField")){
                const battleField = sessionStorage.getItem("battleField")
                game.style.backgroundImage = `url(${battleField})`
            }
    
            startGame(gameAudios)
        })
    }    
}
