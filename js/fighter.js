import {utils} from './utils.js'

const hit = document.getElementById('hit')

const audioPunch = new Audio('../sounds/punch.mp3')
const audioGetPunched = new Audio('../sounds/hit.mp3')

audioPunch.volume = .1
audioGetPunched.volume = .2

export class Fighter{
    constructor(DOMelement, side){
        this.select = DOMelement
        this.side = side //left or right to manage properly the specific caracter
        this.position = utils.getTranslateX(this.select) //position on the board 
        this.life = 4
        this.animationType = 'idle' 
        this.direction = []
        this.distance = null
    }

    punch(opponent){

        if(this.animationType === 'punch') return 
 
        this.animationType = "punch"
        audioPunch.play()

        this.direction = []
        this.select.style.zIndex = '10'

        if(this.distance <= 150){
            
            audioGetPunched.play()
            const dataAttribute = opponent.select.dataset.player
            const deathClass = `death-${dataAttribute}`
            const lifeSpansRemaining = [...document.querySelectorAll(`.life.${dataAttribute} .lifeSquare`)].filter(span => !span.classList.contains(deathClass))
          
            opponent.animationType = 'getPunched'
            opponent.life--  
            lifeSpansRemaining[0].classList.add(deathClass)
            hit.classList.remove('hide')
            
            setTimeout(() => hit.classList.add('hide'), 720)

            if(this.side === 'left'){
                hit.style.transform = `translate3d(${this.position + 230}px, 0, 0)`
            }
            if(this.side === 'right'){
                hit.style.transform = `translate3d(${this.position - 230}px, 0, 0)`
            }

            setTimeout(() => {
                this.select.style.zIndex = '1'
                opponent.animationType === 'getPunched' ? opponent.setAnimationType("idle") : null

            }, 320)
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

            this.select.style.transform = `translate3d(${this.position}px, 0, 0)`
        }
    }

    setAnimationType(animation){
        if(this.setAnimationType === "punch" || this.setAnimationType === "getPunched") return 
        if(animation === "crouch"){
            this.direction = []
        }
        return this.animationType = animation
    }

}