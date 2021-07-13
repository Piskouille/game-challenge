import { utils } from './utils.js'
import { spriteParams } from './spriteParams.js'
import { Fighter } from './fighter.js'

export function startGame(){

    const audioStart = new Audio('../sounds/start.mp3')
    const audioWin = new Audio('../sounds/win.mp3')
    const audioLoose = new Audio('../sounds/loose.mp3')
    const audioBackground = new Audio('../sounds/background.mp3')

    let END_OF_GAME = false
    audioBackground.volume = .5
    audioStart.volume = .1
    audioWin.volume = audioLoose.volume = .4
   
    audioStart.play()
    //this doesn't work for some reasons 
    //audioStart.addEventListener('ended', () => console.log('ened'))
    setTimeout(() => audioBackground.play(), 3000)
 

    const firstFighter = document.getElementById('fighter-1')
    const secondFighter = document.getElementById('fighter-2')

    const me = new Fighter(firstFighter, "left")
    const vs = new Fighter(secondFighter, "right")

    const timer = document.querySelector('.timer')
    const countdown = document.querySelector('.countdown')

    let FRAMES = {
        FRAMES_IDLE : 0,
        FRAMES_WALK : 0,
        FRAMES_CROUCH : 0,
        FRAMES_PUNCH : 0,
        FRAMES_GETPUNCHED : 0,
        FRAMES_HIT : 0,
        FRAMES_DEAD : 0,
        FRAMES_VICTORY : 0
    }


    let isPunching = "false"   //can be "true" to trigger the timeout, "false" to trigger punch method, or buffering to exit the keydown listener
    let waitingForPunch = null

    const handleKeyDown = function(e){
      if(e.key === " "){
        //There is some delay between 1st and 2nd punch when maintaining space bar pushed that I don't understand
        if(isPunching === "buffering") return
        if(isPunching === "true"){
            isPunching = "buffering"
            setTimeout(() => me.setAnimationType('idle'), 400)
            return waitingForPunch = setTimeout(() => isPunching = "false", 1000) //can throw punch every 1s minimum
        }
        isPunching = "true"
        FRAMES.FRAMES_PUNCH = 0
        me.setAnimationType('punch')
        return me.punch(vs)
      } 
      if(e.key === "ArrowDown") return me.setAnimationType("crouch")      
      if(e.key === "ArrowRight") return me.setDirection("right")
      if(e.key === "ArrowLeft") return me.setDirection("left")
    }
    
    const handleKeyUp = function(e){

        if(e.key === " "){
            isPunching = "false"
            clearTimeout(waitingForPunch)
           return setTimeout(() => me.animationType === 'punch' ? me.setAnimationType("idle") : null, 400) //400 is the time of the punch animation in ms
        }
        if(e.key === "ArrowDown"){
           return me.setAnimationType("idle")  //crouch gameplay : stay crouched while arrodown is pushed, stops as soon as arrowdown is released of another key is pressed (punch, left or right)
        }
        if(e.key === "ArrowRight"){
            me.setAnimationType("idle")
            return me.cleanDirection("right")
        }  
        if(e.key === "ArrowLeft"){
            me.setAnimationType("idle")
            return me.cleanDirection("left")
        } 
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    
    function game(){ 

        me.setDistance(vs)

        me.moves()
        
        animate(me, FRAMES)
        animate(vs, FRAMES)
   

        if(!hit.classList.contains('hide')){
            FRAMES.FRAMES_HIT = utils.animateSprite(spriteParams, 'hit', FRAMES.FRAMES_HIT, hit)
        }

//! PROBLEM 
        if(me.isDead()){
            countdown.innerText = 'LOOSE'
            audioLoose.play()

            enfOfGame(vs)
        }
        if(vs.isDead()){
            //FRAMES_DEAD = utils.animateSprite(spriteParams, 'dead', FRAMES_DEAD, vs.select)
            countdown.innerText = 'WIN'
            audioWin.play()

            enfOfGame(me)
        }
        if(+timer.innerHTML === 0){
            countdown.innerText = 'Time Out'
            enfOfGame()
        }

        requestAnimationFrame(game)
    }

    const rAF = requestAnimationFrame(game)

    //! HAVE TO STOP COUNTDOWN AS WELL - MAKE THE REMATCH BUTTON APPEAR
    function enfOfGame(elem){

        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('keyup', handleKeyUp) 
        audioBackground.pause()
        if(elem){
            setTimeout(() => elem.setAnimationType(""), 400)
            setTimeout(() => elem.setAnimationType("victory"), 1000)   
        }
    }

    function animate(elem, FRAMES){
        //function (spriteParams, animationName, frames ,staggerFrames, DOMelement)
        if(elem.animationType === "punch") FRAMES.FRAMES_PUNCH = utils.animateSprite(spriteParams, 'punch', FRAMES.FRAMES_PUNCH, elem.select)
        if(elem.animationType === "getPunched") FRAMES.FRAMES_GETPUNCHED = utils.animateSprite(spriteParams, 'getPunched', FRAMES.FRAMES_GETPUNCHED, elem.select)
        if(elem.animationType === "idle") FRAMES.FRAMES_IDLE = utils.animateSprite(spriteParams, 'idle', FRAMES.FRAMES_IDLE, elem.select)
        if(elem.animationType === "walk") FRAMES.FRAMES_WALK = utils.animateSprite(spriteParams, 'walk', FRAMES.FRAMES_WALK, elem.select)
        if(elem.animationType === "crouch") FRAMES.FRAMES_CROUCH = utils.animateSprite(spriteParams, 'crouch', FRAMES.FRAMES_CROUCH, elem.select)
        if(elem.animationType === "dead"){
            if(FRAMES.FRAMES_DEAD <= 54) FRAMES.FRAMES_DEAD = utils.animateSprite(spriteParams, 'dead', FRAMES.FRAMES_DEAD, elem.select)
            if(FRAMES.FRAMES_DEAD > 54) utils.animateSprite(spriteParams, 'dead', 54, elem.select)
        }
        if(elem.animationType === "victory"){
            elem.select.style.transition = 'transform 1s ease-out'
            elem.select.style.transform = 'translate3d(390px, 0, 0)'
            if(FRAMES.FRAMES_VICTORY <= 54) FRAMES.FRAMES_VICTORY = utils.animateSprite(spriteParams, 'victory', FRAMES.FRAMES_VICTORY, elem.select)
            if(FRAMES.FRAMES_VICTORY > 54) utils.animateSprite(spriteParams, 'victory', 54, elem.select)
        }
    }
     
}

