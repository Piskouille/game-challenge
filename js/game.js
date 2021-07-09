import {utils} from './utils.js'
import { spriteParams } from './spriteParams.js'

const me = document.getElementById('fighter-1')
const vs = document.getElementById('fighter-2')

let userDirection = [] //used to make our fighter move proprely 
let frames = 0 //used to animate sprites combined with staggerFrame
let animationType = 'idle' //used to animate sprites we reset it here since it is the default attitude 

document.addEventListener('keydown', handleKeyDown)
document.addEventListener('keyup', handleKeyUp)

function handleKeyDown(e){

  if(e.key === " "){
    return animationType = "punch"
  }  
  if(e.key === "ArrowDown"){
      return animationType = "crouch"
  }
  
  if(userDirection.length >= 2) return //just for safetyness 
  if(e.key === "ArrowRight" && !userDirection.includes("right")){
    animationType = 'walk'
    return userDirection = ["right", ...userDirection]
  } 
  if(e.key === "ArrowLeft" && !userDirection.includes("left")){
    animationType = 'walk'
    return userDirection = ["left", ...userDirection]
  } 
 
}

function handleKeyUp(e){
  
    if(e.key === "ArrowRight"){
        animationType = 'idle'
        return userDirection = userDirection.filter(u => u !== "right")
    }  
    if(e.key === "ArrowLeft"){
        animationType = 'idle'
        return userDirection = userDirection.filter(u => u !== "left")
    } 
    if(e.key === " "){
        return animationType = "idle"
    }
}
  


function game(){
    //MOVEMENT TRIGGERED BY KEYBOARD
    let postion = utils.getTranslateX(me)


    if(userDirection.length !== 0){
        
        if(userDirection[0] === "left" && postion > -90){
            postion -= 10
        }
        if(userDirection[0] === 'right' && postion < 870){ //-90 and 870 should be calculated depending on #game width to make layout responsive 
            postion += 10
        }
    }


    me.style.transform = `translate3d(${postion}px, 0, 0)`

    //function (spriteParams, animationName, frames ,staggerFrames, DOMelement)
    frames = utils.animateSprite(spriteParams, animationType, frames, 5, me)

    requestAnimationFrame(game)
}

const rAF = requestAnimationFrame(game)