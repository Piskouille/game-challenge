import { utils } from './utils.js'
import { spriteParams } from './spriteParams.js'
import { Fighter } from './fighter.js'
import { dumbBot } from './bot.js'

export function startGame(gameAudios){
    gameAudios.audioBackground.audio.volume = .2
    gameAudios.audioStart.audio.volume = gameAudios.audioPunch.audio.volume = .1
    gameAudios.audioWin.audio.volume = gameAudios.audioLoose.audio.volume = .4 
 
    let letsGo = false //prevent for punching each other right away
    let endOfTheGame = false //prevent game over call to loop

    const firstFighter = document.getElementById('fighter-1')
    const secondFighter = document.getElementById('fighter-2')

    const me = new Fighter(firstFighter, "left")
    const vs = new Fighter(secondFighter, "right")

    const hit_me = document.getElementById('hit-player-1')
    const hit_vs = document.getElementById('hit-player-2')

    const timer = document.querySelector('.timer')
    const countdown = document.querySelector('.countdown')

    //Audio and clocks management 
    setTimeout(() => utils.countdown(3, countdown, true), 1000)
    setTimeout(() => {
        letsGo = true
        utils.countdown(99, timer)
    }, 4000)  
    setTimeout(() => gameAudios.audioStart.audio.play(), 1000)
    //audioStart.addEventListener('ended', () => console.log('ened'))    ~~     this doesn't work for some reasons 
    setTimeout(() => gameAudios.audioBackground.audio.play(), 3000)
    document.body.style.cursor = 'none'

    //To animate the sprites
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

    /* ************************* OUR  BEHAVIOUR ***********************/
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

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    /* ***************************************************************/

    /* ************************* THE BOT BEHAVIOUR ***********************/
    const BOTKeyDown = setInterval(() => {

        const dumbMove = dumbBot(vs, me, letsGo)
     
        if(dumbMove === " " && letsGo && vs.isPunching === "rest"){
            if(vs.isPunching === "buffering" || vs.isPunching === "punch") return 
   
            return vs.setPunching("punch")
          } 
          if(dumbMove === "ArrowRight"){
            vs.cleanDirection()
            vs.setAnimationType("idle")  
            vs.setDirection("right")
          }
          if(dumbMove === "ArrowLeft"){
            vs.cleanDirection() 
            vs.setAnimationType("idle") 
            vs.setDirection("left")
          }
    }, 400)

    const BOTKeyUp = setInterval(() => {

        if(vs.animationType === "walk"){
            vs.setAnimationType("idle")
            vs.cleanDirection()
        }   
    }, 800)
    /* ***************************************************************/

    /* ****************************************************************************************************************************   
    ********************************************************* GAME ***************************************************************
    ****************************************************************************************************************************** */ 
    
    function game(){ 
 
        me.setDistance(vs)
        vs.setDistance(me)

   
    /* ********************************************** Managing the drawing of our caracter ***************************************** */

        if(me.isPunching === "punch" && !me.isGettingPunched){

            //Bot dodging probability : let say it depends on the bot's life
            if(vs.distance > 300) proba_dodge = 0
            else proba_dodge = (-2 * vs.life / 3 + 11 / 3) / 4

            trial_dodge = utils.probability(proba_dodge)
            if(trial_dodge && !vs.isCrouching){
                vs.toggleCrouching()
                setTimeout(() => vs.toggleCrouching(), 200)    // /!\ HERE we set it to 200ms to that the BOT can make a fulgurent backfire combo "crouch-dodge-stand-punch"         
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

        if(!me.isCrouching && me.isPunching === "rest" && !me.isGettingPunched && !endOfTheGame) me.setAnimationType('idle')
        if(me.isCrouching && me.isPunching === "rest" && !me.isGettingPunched && !endOfTheGame) me.setAnimationType('crouch')
        if(me.isGettingPunched && !endOfTheGame) me.setAnimationType("getPunched")

    
    /* *********************************************** Managing the drawing of the BOT ********************************************** */

        if(vs.isPunching === "punch" && !vs.isCrouching && !vs.isGettingPunched){
            
            FRAMES_VS.FRAMES_PUNCH = 0
            gameAudios.audioPunch.audio.play()

            vs.setPunching("buffering")
            setTimeout(() => vs.setPunching("rest"), 400) //can throw punch every 400ms minimum
            setTimeout(() => vs.setAnimationType('idle'), 400)
            vs.punch(me)
        }
        
        if(!vs.isCrouching && vs.isPunching === "rest" && !vs.isGettingPunched && !endOfTheGame) vs.setAnimationType('idle')
        if(vs.isCrouching && !endOfTheGame) vs.setAnimationType('crouch') 
        if(vs.isGettingPunched && !endOfTheGame) vs.setAnimationType("getPunched")
     /* ************************************************************************************************************************** */   

        if(me.isPunching === "rest" && !me.isGettingPunched  && !me.isCrouching && !endOfTheGame) me.moves()
        if(vs.isPunching === "rest" && !vs.isGettingPunched  && !vs.isCrouching && !endOfTheGame) vs.moves()        



        if(me.isDead()){
            countdown.innerText = 'LOOSE'
            if(!endOfTheGame){
                gameAudios.audioLoose.audio.play()
                endOfTheGame = true
                endOfGame(vs)
            }  
        }
        if(vs.isDead()){
            countdown.innerText = 'WIN'
            if(!endOfTheGame){
                gameAudios.audioWin.audio.play()
                endOfTheGame = true
                endOfGame(me)
            }
        }
        if(+timer.innerHTML === 0){
            countdown.innerText = 'Time Out'
            if(!endOfTheGame){
                endOfTheGame = true
                endOfGame()
            }  
        }

        //Drawing the hit sparking sprites
        if(!hit_me.classList.contains('hide')) FRAMES_ME.FRAMES_HIT = utils.animateSprite(spriteParams, 'hit', FRAMES_ME.FRAMES_HIT, hit_me)
        if(!hit_vs.classList.contains('hide')) FRAMES_VS.FRAMES_HIT = utils.animateSprite(spriteParams, 'hit', FRAMES_VS.FRAMES_HIT, hit_vs)
        
        //Drawing the players
        animate(me, FRAMES_ME)
        animate(vs, FRAMES_VS)

        requestAnimationFrame(game)
    }

    const rAF = requestAnimationFrame(game)

    /* *********************************************** Managing the end of the game : win - loose - timeout ********************************************** */
    function endOfGame(elem){
        const playAgain = document.querySelector('.end-menu')
        playAgain.classList.remove('hide')
        document.body.style.cursor = 'default'

        gameAudios.audioBackground.audio.pause()
        utils.clearCountdown()

        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('keyup', handleKeyUp) 

        clearTimeout(BOTKeyDown)
        clearTimeout(BOTKeyUp)

        if(elem){
            setTimeout(() => elem.setAnimationType(""), 400)
            setTimeout(() => elem.setAnimationType("victory"), 1000)   
        }
        else{
            me.setAnimationType('idle')
            vs.setAnimationType('idle')
        }

        setTimeout(() => {
            document.addEventListener('keydown', (e) => {
                if(e.key === " ") return window.location.href = "/game-challenge/game.html"
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

