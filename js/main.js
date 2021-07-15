import { utils } from "./utils.js"
import { startGame } from "./game.js"

const gameAudios = { 
    'audioSelect': {url: 'sounds/selection-map.mp3', audio: null},
    'audioGo': {url: 'sounds/go.mp3', audio: null},
    'audioStart' : {url: 'sounds/start.mp3', audio: null},
    'audioWin' : {url: 'sounds/win.mp3', audio: null},
    'audioLoose' : {url: 'sounds/loose.mp3', audio: null},
    'audioBackground' : {url: 'sounds/background.mp3', audio: null},
    'audioPunch' : {url: 'sounds/punch.mp3', audio: null}
}

const gameMaps = { 
    'map1': {url: 'images/map1.gif', image: null},
    'map2': {url: 'images/map2.gif', image: null},
    'map3' : {url: 'images/map3.gif', image: null}
}

const promises = Object.values(gameAudios).map(v => utils.audioLoader(v)).concat(Object.values(gameMaps).map(v => utils.imageLoader(v)))

Promise
    .all(promises)
    .then(() => mainFunction(gameAudios))
    .catch(error => console.log('Cannot load game assets ...', error))

function mainFunction(gameAudios){
    console.log("here")
    if(window.location.pathname.includes("/index.html")){

        const maps = document.querySelectorAll('.maps-thumbnails img')
        const start = document.getElementById('startGame')

        gameAudios.audioSelect.audio.volume = gameAudios.audioGo.audio.volume = .1
    
        sessionStorage.clear()
        sessionStorage.setItem("battleField", "map1")
    
        maps.forEach(map => {
            map.addEventListener('click', () => {
                const selected = document.querySelector('img.selected')
                
                gameAudios.audioSelect.audio.currentTime = 0
                gameAudios.audioSelect.audio.play()
    
                selected.classList.remove('selected')
                map.classList.add('selected')
                sessionStorage.setItem("battleField", map.dataset.mapName)
            })
        })
    
        start.addEventListener('click', () => {
            gameAudios.audioGo.audio.play()
            setTimeout(() => window.location.href = "game.html", 1000)
        })
    }
    
    if(window.location.pathname.includes("/game.html")){
        const game = document.querySelector("#game")

        if(sessionStorage.getItem("battleField")){
            const battleField = sessionStorage.getItem("battleField")
            
            game.style.backgroundImage = `url(/images/${battleField}.gif)`
        }
            startGame(gameAudios)
    }
}

