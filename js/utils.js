export const utils = {

    timeoutsArray: [],
    // launching ->  argument is true for the game start; false for the countdown in game
    // for the game start (launching === true) the number is displayed 800ms everysecond
    countdown : function(durationInSeconds, DOMelement, launching = false){

        for(let i = 0 ; i < durationInSeconds ; i++){
          const thisTimeout = setTimeout(() => {
            DOMelement.innerText = durationInSeconds - i
          }, i * 1000)

          utils.timeoutsArray.push(thisTimeout)
          
          if(launching){
            setTimeout(() => {
                DOMelement.innerText = null
              }, i * 1000 + 800)
          }
        }
        
        if(launching){
            setTimeout(() => {
                DOMelement.innerText = "Fight !"
            }, durationInSeconds * 1000)

            setTimeout(() => {
                DOMelement.innerText = null
              }, durationInSeconds * 1000 + 1000)
          
        }

        if(!launching){
            setTimeout(() => {
                DOMelement.innerText = "00"
              }, durationInSeconds * 1000)
        }
    },

    clearCountdown: function(){
      return utils.timeoutsArray.forEach(a => clearTimeout(a))
    },

    getTranslateX : function(elem){
        const matrix = window.getComputedStyle(elem).transform

        if(matrix === "none" || typeof matrix === 'undefined') return 0

        const matrixValues =  matrix.match(/matrix.*\((.+)\)/)[1].split(', ')
       
        return parseInt(matrixValues["4"])
        //! Be carefull : if 3d transform are applyed the computed matrix length is 16 means translateX key becomes "11"
    }, 

    getDistance : function(a, b){
      if(a * b >= 0) return Math.abs(b-a)
      if(a < 0) return b - a
      return a - b 
    },

    /*
    @param  spriteParams  -> the constant where are stored all animations parameters
            animationName -> is the animation name we want it will give us the coordinates and the number of frames of the animation
            frames -> increment each time the function is called should be then returned 
            DOMelement -> is the target in which the sprite will be animated   
            blocked -> false by default, if true stay on the last sprite image (used especially to crouch)
            * !!!! pfiou this was hard */
    animateSprite : function (spriteParams, animationName, frames, DOMelement) {
        const animation = spriteParams.find(s => s.name === animationName)
        const staggerFrames = animation.stagger
        const position = Math.floor(frames/staggerFrames) % animation.nbFrames
        const frameY = animation.Ycoordinates
        let frameX 

        if(animationName === "crouch"){
            frameX = animation.Xcoordinates.slice().pop()
        }
        else{
            frameX = animation.Xcoordinates[position]
        }
        
        DOMelement.style.backgroundPosition = `${frameX}px ${frameY}px`
    
        return ++frames
    },
    
    //obj = {objName: {audio: null, url: '.audioPath/img.mp3}}
    audioLoader : function(obj){
      return new Promise((res, rej) => {
        obj.audio = new Audio
        obj.audio.autoplay = false
        obj.audio.onloadeddata = () => res() 
        obj.audio.onerror = () => rej(new Error(`Unable to load audio: ${obj.url}`))
        obj.audio.src = obj.url
      })
    }, 

    probability: function(n){
      return n !== 0 && Math.random() <= n
    },

    linearProjection: function(min, max, target1 = 0, target2 = 1, param){
      const factor = (target1 - target2)/(min-max)
      return Math.min(1, Math.max(0, factor*param + target1 - factor * min)) //Math.min et max just in case : we want the result to be a proba so between 0 and 1
    }
}




