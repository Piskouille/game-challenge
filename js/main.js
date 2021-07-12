import { utils } from "./utils.js"
import { startGame } from "./game.js"

if(window.location.pathname ===  "/index.html"){
    window.addEventListener('load', () => {
        const game = document.querySelector("#game")
        const countdown = document.querySelector('.countdown')
        const timer = document.querySelector('.timer')

        if(sessionStorage.getItem("battleField")){
            const battleField = sessionStorage.getItem("battleField")
            game.style.backgroundImage = `url(${battleField})`
        }

        utils.countdown(3, countdown, true)
        const countdownTimeout = setTimeout(() => utils.countdown(99, timer), 3000) //would be better to clean it at the end of the game

        startGame(countdownTimeout)
    })

}


if(window.location.pathname ===  "/instructions.html"){
    const maps = document.querySelectorAll('.maps-thumbnails img')
    const start = document.getElementById('startGame')
    const audioSelect = new Audio('../sounds/selection-map.mp3')
    const audioStart = new Audio('../sounds/go.mp3')
    audioSelect.volume = audioStart.volume = .1

    maps.forEach(map => {
        map.addEventListener('click', () => {
            const selected = document.querySelector('img.selected')
            
            audioSelect.currentTime = 0
            audioSelect.play()

            selected.classList.remove('selected')
            map.classList.add('selected')
            sessionStorage.setItem("battleField", map.src)
        })
    })

    start.addEventListener('click', () => {
        audioStart.play()
        setTimeout(() => window.location.href = "/index.html", 1000)
    })
}
