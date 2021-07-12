import { utils } from './utils.js'
import { spriteParams } from './spriteParams.js'
import { Fighter } from './fighter.js'

export function startGame(){

    const audioStart = new Audio('../sounds/start.mp3')
    const audioVictory = new Audio('../sounds/victory.mp3')
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

    let FRAMES = 0                  //used to animate sprites combined with staggerFrame
    let FRAMES_HIT = 0
    let FRAMES_DEAD = 0

    const handleKeyDown = function(e){
      if(e.key === " "){
        return me.punch(vs)
      } 
      if(e.key === "ArrowDown") return me.setAnimationType("crouch")      
      if(e.key === "ArrowRight") return me.setDirection("right")
      if(e.key === "ArrowLeft") return me.setDirection("left")
    }
    
    const handleKeyUp = function(e){

        if(e.key === " "){
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
        
        //function (spriteParams, animationName, frames ,staggerFrames, DOMelement)
        FRAMES = utils.animateSprite(spriteParams, me.animationType, FRAMES, me.select)
        utils.animateSprite(spriteParams, vs.animationType, FRAMES, vs.select)
        if(!hit.classList.contains('hide')){
            FRAMES_HIT = utils.animateSprite(spriteParams, 'hit', FRAMES_HIT, hit)
        }

//! PROBLEM 
        if(me.isDead()){
            countdown.innerText = 'LOOSE'
            audioBackground.pause()
            audioLoose.play()
            setTimeout(() => vs.setAnimationType("victory"), 3000)
            setTimeout(() => END_OF_GAME = true, 600)
        }
        if(vs.isDead()){
            FRAMES_DEAD = utils.animateSprite(spriteParams, 'dead', FRAMES_DEAD, vs.select)
            countdown.innerText = 'WIN'
            audioBackground.pause()
            audioWin.play()
            setTimeout(() => me.setAnimationType("victory"), 3000)
            setTimeout(() => END_OF_GAME = true, 960)
        }
        if(+timer.innerHTML === 0){
            countdown.innerText = 'Time Out'
        }

        if(END_OF_GAME) return
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

