import {utils} from './utils.js'
import { spriteParams } from './spriteParams.js'

export function startGame(){

    const me = document.getElementById('fighter-1')
    const vs = document.getElementById('fighter-2')
    
    let userDirection = []          //used to make our fighter move proprely accordingly to the gameplay we want : the user can click both left and right at the saùe time, it'll behave according to the 2nd pushed key ; according to the 1st when 2nd is released 
    let frames = 0                  //used to animate sprites combined with staggerFrame
    let animationType = 'idle'      //used to animate sprites we reset it here since it is the default attitude 
    
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    
    function handleKeyDown(e){
    
      if(e.key === " "){
        animationType = "punch"
      }  
      if(e.key === "ArrowDown"){
          return animationType = "crouch"
      }
      
      //In the below, some conditions are just for safety - redondances 
      if(userDirection.length >= 2) return         
      if(e.key === "ArrowRight" && !userDirection.includes("right")) return userDirection = ["right", ...userDirection] 
      if(e.key === "ArrowLeft" && !userDirection.includes("left")) return userDirection = ["left", ...userDirection]
    }
    
    function handleKeyUp(e){

        if(e.key === " "){
            setTimeout(() => animationType === 'punch' ? animationType = "idle" : null, 640) 
        }
        if(e.key === "ArrowDown"){
           return animationType = "idle"  //game play du crouuch : stay crouched while arrodown is pushed, stops as soon as arrowdown is released of another key is pressed (punch, left or right)
        }
        if(e.key === "ArrowRight"){
            animationType = 'idle'
            return userDirection = userDirection.filter(u => u !== "right")
        }  
        if(e.key === "ArrowLeft"){
            animationType = 'idle'
            return userDirection = userDirection.filter(u => u !== "left")
        } 
    }
    
    function game(){
        //MOVEMENT TRIGGERED BY KEYBOARD
        let postion = utils.getTranslateX(me)
        if(animationType === "crouch"){
            userDirection = []
            animationType = "crouch"
        } 
        if(userDirection.length !== 0){
            animationType = 'walk'
            if(userDirection[0] === "left" && postion > -90){
                postion -= 10
            }
            if(userDirection[0] === 'right' && postion < 870){ //-90 and 870 should be calculated depending on #game width to make layout responsive 
                postion += 10
            }
        }
        
        me.style.transform = `translate3d(${postion}px, 0, 0)`
    
        //function (spriteParams, animationName, frames ,staggerFrames, DOMelement)
        frames = utils.animateSprite(spriteParams, animationType, frames, me)
    
        requestAnimationFrame(game)
    }
    
    const rAF = requestAnimationFrame(game)
    
    //FIN DU JEU
    /* document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp) 
    window.cancelAnimationFrame(rAF);
    */
    
    


}
