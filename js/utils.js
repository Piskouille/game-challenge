export const utils = {
    // launching ->  argument is true for the game start; false for the countdown in game
    // for the game start (launching === true) the number is displayed 800ms everysecond
    countdown : function(durationInSeconds, DOMelement, launching = false){

        for(let i = 0 ; i < durationInSeconds ; i++){
          setTimeout(() => {
            DOMelement.innerText = durationInSeconds - i
          }, i * 1000)
          
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

/*     debounce: function(fun, delay, immediate = false){
      let res
      let timeout = null
      return function(){
        const args = arguments
        const ctx = this

        const later = function(){
          timeout = null
          if(!immediate) res = fun.apply(this, args)
        }

        const callRightAway = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, delay)

        if(callRightAway) res = fun.apply(ctx, args)

        return res
        
      }
    }, 

    throttle: function(fun, delay, leading = true, trailing = false){
      let ctx, args, res
      let timeout = null
      let previous = 0

      const later = function(){
        previous = new Date
        timeout = null
        res = fun.apply(ctx, args)
      }

      return function(){
        const now = new Date
        
        if(!previous && ! leading) previous = now

        const remaining = delay - (now - previous)
        ctx = this
        args = arguments

        if(remaining <= 0){
          clearTimeout(timeout)
          timeout = null
          previous = now

          res = fun.apply(ctx, args)
        }
        if(!timeout && trailing){
          timeout = setTimeout(later, remaining)
        }

        return res
      }
    } */

/*
    //obj = {name: , image: null, url: '.imgPath/img.jpeg or png or whatever}
     imageLoader : function(obj){
      return new Promise((res, rej) => {
        obj.image = new Image
        obj.image.onload = () => res() 
        obj.image.onerror = () => rej(new Error(`Unable to load image: ${obj.url}`))
    
        obj.image.src = obj.url
      })
    }, 
*/


}




