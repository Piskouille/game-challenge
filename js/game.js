import { utils } from './utils.js'
import { spriteParams } from './spriteParams.js'
import { Fighter } from './fighter.js'
import { dumbBot } from './bot.js'

export function startGame(gameAudios){

    gameAudios.audioBackground.audio.volume = .2
    gameAudios.audioStart.audio.volume = gameAudios.audioPunch.audio.volume = .1
    gameAudios.audioWin.audio.volume = gameAudios.audioLoose.audio.volume = .4 
 
    let letsGo = false //prevent for punching each other right away
    let endGameAudio = false //prevent game over call to loop

    const firstFighter = document.getElementById('fighter-1')
    const secondFighter = document.getElementById('fighter-2')

    const me = new Fighter(firstFighter, "left")
    const vs = new Fighter(secondFighter, "right")

    const hit_me = document.getElementById('hit-player-1')
    const hit_vs = document.getElementById('hit-player-2')

    const timer = document.querySelector('.timer')
    const countdown = document.querySelector('.countdown')

    setTimeout(() => utils.countdown(3, countdown, true), 1000)
    setTimeout(() => {
        letsGo = true
        utils.countdown(99, timer)
    }, 4000)  
    setTimeout(() => gameAudios.audioStart.audio.play(), 1000)
    //audioStart.addEventListener('ended', () => console.log('ened'))    ~~     this doesn't work for some reasons 
    setTimeout(() => gameAudios.audioBackground.audio.play(), 3000)

    let FRAMES_ME = {
        FRAMES_IDLE : 0,
        FRAMES_WALK : 0,
        FRAMES_CROUCH : 0,
        FRAMES_PUNCH : 0,
        FRAMES_GETPUNCHED : 0,
        FRAMES_DEAD : 0,
        FRAMES_VICTORY : 0,
        FRAMES_HIT: 0
    } 

    let FRAMES_VS = {
        FRAMES_IDLE : 0,
        FRAMES_WALK : 0,
        FRAMES_CROUCH : 0,
        FRAMES_PUNCH : 0,
        FRAMES_GETPUNCHED : 0,
        FRAMES_DEAD : 0,
        FRAMES_VICTORY : 0,
        FRAMES_HIT: 0
    } 

    let proba_dodge, trial_dodge //For the BOT

    const handleKeyDown = function(e){
      
      if(e.key === " " && letsGo && me.isPunching === "rest") return me.setPunching("punch")
      if(e.key === "ArrowDown" && !me.isCrouching) return me.toggleCrouching()
      if(e.key === "ArrowRight") return me.setDirection("right") 
      if(e.key === "ArrowLeft") return me.setDirection("left")
    }
    
    const handleKeyUp = function(e){
        if(e.key === "ArrowDown" && me.isCrouching) return me.toggleCrouching()
        if(e.key === "ArrowRight") return me.cleanDirection("right")
        if(e.key === "ArrowLeft") return me.cleanDirection("left") 
    }

    const BOTKeyDown = setInterval(() => {
        if(vs.isPunching === "punch" || me.animationType === "punch") return 
        
        const dumbMove = dumbBot(vs, me, letsGo)
     
        if(dumbMove === " " && letsGo && vs.isPunching === "rest"){
            if(vs.isPunching === "buffering" || vs.isPunching === "punch") return 
   
            return vs.setPunching("punch")
          } 
          if(dumbMove === "ArrowRight") return vs.setDirection("right")
          if(dumbMove === "ArrowLeft") return vs.setDirection("left")
    }, 400)

    const BOTKeyUp = setInterval(() => {
        if(vs.animationType === "getPunched"){
            FRAMES_VS.FRAMES_GETPUNCHED = 0
            vs.toggleIsPunched()
            vs.setAnimationType("idle")
        }
            
        if(vs.animationType === "crouch"){
            FRAMES_VS.FRAMES_CROUCH = 0
            vs.setAnimationType("idle")  //crouch gameplay : stay crouched while arrodown is pushed, stops as soon as arrowdown is released of another key is pressed (punch, left or right)
        }
        if(vs.animationType === "walk"){
            vs.setAnimationType("idle")
            vs.cleanDirection()
        }   
    }, 600)


    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    
    function game(){ 
 
        me.setDistance(vs)
        vs.setDistance(me)
        console.log(vs.isGettingPunched)
        console.log(vs.animationType)
     /* ***************************************************************************************************************************   
    ************************************************ Managing the drawing of our caracter *****************************************
    ****************************************************************************************************************************** */

        if(me.isPunching === "punch"){

            //Bot dodging probability : let say it depends on the bot's life
            if(vs.distance > 300) proba_dodge = 0
            else proba_dodge = (-2 * vs.life / 3 + 11 / 3) / 4

            trial_dodge = utils.probability(proba_dodge)
            if(trial_dodge){
          
                vs.setAnimationType("crouch")
            }
            /* //////////////////////////////////////////////////////// */           

           FRAMES_ME.FRAMES_PUNCH = 0
            gameAudios.audioPunch.audio.play()

            me.setPunching("buffering")
            setTimeout(() => me.setPunching("rest"), 400) //can throw punch every 400ms minimum
            setTimeout(() => {
                if(me.isCrouching) me.setAnimationType('crouch')
                if(me.direction[0] === "left") me.setDirection("left")
                if(me.direction[0] === "right") me.setDirection("right")
                else me.setAnimationType('idle')
            }, 400);
            me.punch(vs)
        }

        if(!me.isCrouching && !me.isWalking && me.isPunching === "rest" && !me.isGettingPunched && me.playing) me.setAnimationType('idle')
        if(me.isCrouching && me.isPunching === "rest" && !me.isGettingPunched && me.playing) me.setAnimationType('crouch')
        if(me.isGettingPunched) me.setAnimationType("getPunched")

     /* ***************************************************************************************************************************   
    ************************************************ Managing the drawing of the BOT **********************************************
    ****************************************************************************************************************************** */
        if(vs.isPunching === "punch"){
            
            FRAMES_VS.FRAMES_PUNCH = 0
            gameAudios.audioPunch.audio.play()

            vs.setPunching("buffering")
            setTimeout(() => vs.setPunching("rest"), 400) //can throw punch every 400ms minimum
            setTimeout(() => vs.setAnimationType('idle'), 400)
            vs.punch(me)
        }
        
        if(!me.isCrouching && !me.isWalking && me.isPunching === "rest" && !me.isGettingPunched && me.playing) me.setAnimationType('idle')

     /* ************************************************************************************************************************** */   

        if(me.isPunching === "rest" && !me.isGettingPunched) me.moves()
        if(vs.isPunching === "rest" && !vs.isGettingPunched) vs.moves()        

        if(me.isDead()){
            countdown.innerText = 'LOOSE'
            if(!endGameAudio){
                gameAudios.audioLoose.audio.play()
                endGameAudio = true
            }
            enfOfGame(vs)
        }
        if(vs.isDead()){
            countdown.innerText = 'WIN'
            if(!endGameAudio){
                gameAudios.audioWin.audio.play()
                endGameAudio = true
            }
            enfOfGame(me)
        }
        if(+timer.innerHTML === 0){
            countdown.innerText = 'Time Out'
            enfOfGame()
        }

        if(vs.isGettingPunched) vs.setAnimationType("getPunched")

        //Drawing the hit sparking sprite
        if(!hit_me.classList.contains('hide')) FRAMES_ME.FRAMES_HIT = utils.animateSprite(spriteParams, 'hit', FRAMES_ME.FRAMES_HIT, hit_me)
        if(!hit_vs.classList.contains('hide')) FRAMES_VS.FRAMES_HIT = utils.animateSprite(spriteParams, 'hit', FRAMES_VS.FRAMES_HIT, hit_vs)
        
        //Drawing the players
        animate(me, FRAMES_ME)
        animate(vs, FRAMES_VS)

        requestAnimationFrame(game)
    }

    const rAF = requestAnimationFrame(game)

    function enfOfGame(elem){
        const playAgain = document.querySelector('.end-menu')
        playAgain.classList.remove('hide')

        gameAudios.audioBackground.audio.pause()
        utils.clearCountdown()

        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('keyup', handleKeyUp) 

        clearTimeout(BOTKeyDown)
        clearTimeout(BOTKeyUp)

        if(elem && elem.playing){
            elem.togglePlaying()
            setTimeout(() => elem.setAnimationType(""), 400)
            setTimeout(() => elem.setAnimationType("victory"), 1000)   
        }
        if(!elem){
            me.setAnimationType('idle')
            vs.setAnimationType('idle')
        }

        setTimeout(() => {
            document.addEventListener('keydown', (e) => {
                if(e.key === " ") return window.location.href = ".game-challenge/game.html"
            })
        }, 2000);
 
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
            elem.select.style.transform = `scaleX(${elem.factor}) translate3d(${elem.factor * 390}px, 0, 0)`
            if(FRAMES.FRAMES_VICTORY <= 54) FRAMES.FRAMES_VICTORY = utils.animateSprite(spriteParams, 'victory', FRAMES.FRAMES_VICTORY, elem.select)
            if(FRAMES.FRAMES_VICTORY > 54) utils.animateSprite(spriteParams, 'victory', 54, elem.select)
        }
    }
}

