import {utils} from './utils.js'
import { spriteParams } from './spriteParams.js'
import { Fighter } from './fighter.js'

export function startGame(){

    const firstFighter = document.getElementById('fighter-1')
    const secondFighter = document.getElementById('fighter-2')

    const me = new Fighter(firstFighter, "left")
    const vs = new Fighter(secondFighter, "right")

    const timer = document.querySelector('.timer')
    const countdown = document.querySelector('.countdown')

    let FRAMES = 0                  //used to animate sprites combined with staggerFrame
    let FRAMES_HIT = 0

    const handleKeyDown = function(e){
      if(e.key === " "){
        me.setAnimationType("punch")
        return me.punch(vs)
      } 
      if(e.key === "ArrowDown") return me.setAnimationType("crouch")      
      if(e.key === "ArrowRight") return me.setDirection("right")
      if(e.key === "ArrowLeft") return me.setDirection("left")
    }
    
    const handleKeyUp = function(e){

        if(e.key === " "){
            return setTimeout(() => me.animationType === 'punch' ? me.setAnimationType("idle") : null, 320) //320 is the time of the punch animation in ms
        }
        if(e.key === "ArrowDown"){
           return me.setAnimationType("idle")  //game play du crouuch : stay crouched while arrodown is pushed, stops as soon as arrowdown is released of another key is pressed (punch, left or right)
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
        
        //function (spriteParams, animationName, frames ,staggerFrames, DOMelement)
        FRAMES = utils.animateSprite(spriteParams, me.animationType, FRAMES, me.select)
        utils.animateSprite(spriteParams, vs.animationType, FRAMES, vs.select)
        if(!hit.classList.contains('hide')){
            FRAMES_HIT = utils.animateSprite(spriteParams, 'hit', FRAMES_HIT, hit)
        }

//! PROBLEM 
        if(me.life <= 0){
            setTimeout(() => vs.setAnimationType("victory"), 3000)
        }
        if(vs.life <= 0){
            setTimeout(() => me.setAnimationType("victory"), 3000)
        }
        if(+timer.innerHTML === 0){
            countdown.innerText = 'Time Out'
        }
        requestAnimationFrame(game)
    }

    const rAF = requestAnimationFrame(game)

    //! HAVE TO STOP COUNTDOWN AS WELL - MAKE THE REMATCH BUTTON APPEAR
    function enfOfGame(){
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('keyup', handleKeyUp) 
        window.cancelAnimationFrame(rAF)
    }
     
}

