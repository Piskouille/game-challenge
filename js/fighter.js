import {utils} from './utils.js'

const hit = document.querySelectorAll('.hit')

const audioGetPunched = new Audio('../sounds/hit.mp3')

audioGetPunched.pause()
audioGetPunched.volume = .15

export class Fighter{
    constructor(DOMelement, side){
        this.select = DOMelement
        this.side = side //left or right to manage properly the specific caracter
        this.factor = side === 'left' ? 1 : -1
        this.position = utils.getTranslateX(this.select) //position on the board 
        this.life = 4
        this.animationType = 'idle' 
        this.direction = []
        this.distance = null
    }   

    punch(opponent){
        this.setDistance(opponent)
        this.direction = []

        if(this.distance <= 150 && opponent.animationType !== 'crouch'){
            
            audioGetPunched.play()
            const dataAttribute = opponent.select.dataset.player
            const deathClass = `death-${dataAttribute}`
            const lifeSpansRemaining = [...document.querySelectorAll(`.life.${dataAttribute} .lifeSquare`)].filter(span => !span.classList.contains(deathClass))
          
            this.select.style.zIndex = '10'

            opponent.animationType = 'getPunched'
            opponent.life--  
            if(lifeSpansRemaining[0]){
                lifeSpansRemaining[0].classList.add(deathClass)
            }

            const hit_player = [...hit].find(h => h.id === `hit-${dataAttribute}`)
            hit_player.classList.remove('hide')
            
            setTimeout(() => hit_player.classList.add('hide'), 768)

            hit_player.style.transform =  `scaleX(${this.factor}) translate3d(${this.factor * this.position + (115 * this.factor + 115) }px, 0, 0)`

            setTimeout(() => {
                this.select.style.zIndex = '1'
                opponent.animationType === 'getPunched' ? opponent.setAnimationType("idle") : null

            }, 768)
        }
    }

    isDead(){
        if(this.life > 0) return false
        this.animationType = 'dead'
        return true
    }

    setDirection(direction){
        if(this.direction.length >= 2) return  // Just out of safety
        if(!this.direction.includes(direction)) return this.direction = [direction, ...this.direction] 
    }

    cleanDirection(direction){
        if(!direction) this.direction = []
        this.direction = this.direction.filter(d => d !== direction)
    }

    setDistance(opponent){
        return this.distance = utils.getDistance(this.position, opponent.position)
    }

    moves(){
        if(this.direction.length !== 0){
            this.setAnimationType("walk")


            //-90 and 870 should be calculated depending on #game width to make layout responsive 
            //the distance condition is here so the 2 fighters don't collaps or go through each other
            if(this.direction[0] === "left" 
                && this.position > -90
                && (this.side === "left" || this.distance > 100)
               ){
                this.position -= 10
            }
            if(this.direction[0] === 'right' 
                && this.position < 870
                && (this.side === "right" || this.distance > 100)){ 
                this.position += 10
            }

            this.select.style.transform = `scaleX(${this.factor}) translate3d(${this.factor * this.position}px, 0, 0)`
        }
    }

    setAnimationType(animation){
        if(animation === "crouch"){
            this.direction = []
        }
        return this.animationType = animation
    }

}