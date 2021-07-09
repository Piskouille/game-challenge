
//probleme avec le changement de map
//let battleField

if(window.location.pathname ===  "/index.html"){
    window.addEventListener('load', () => {
        const game = document.querySelector("#game")
        game.style.backgroundImage = `url(${battleField})`
    })

}


if(window.location.pathname ===  "/instructions.html"){
    const maps = document.querySelectorAll('.maps-thumbnails img')

    maps.forEach(map => {
        map.addEventListener('click', () => {
            const selected = document.querySelector('img.selected')
            selected.classList.remove('selected')
            map.classList.add('selected')

        })
    })
    battleField = document.querySelector('.selected')
}
