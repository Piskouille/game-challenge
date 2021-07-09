export const utils = {
    // launching ->  argument is true for the game start; false for the countdown in game
    // for the game start (launching === true) the number is displayed 800ms everysecond
    countdown : function(durationInSeconds, DOMelement, launching){
        console.log(DOMelement)
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

    /*
    @param  spriteParams  -> the constant where are stored all animations parameters
            animationName -> is the animation name we want it will give us the coordinates and the number of frames of the animation
            frames -> increment each time the function is called should be then returned 
            staggerFrame -> limits the animation velocity 
            DOMelement -> is the target in which the sprite will be animated   
            blocked -> false by default, if true stay on the last sprite image (used especially to crouch)
            * !!!! pfiou this was hard */
    animateSprite : function (spriteParams, animationName, frames ,staggerFrames, DOMelement, blocked = false) {
        const animation = spriteParams.find(s => s.name === animationName)
        const position = Math.floor(frames/staggerFrames) % animation.nbFrames
        const frameY = animation.Ycoordinates
        let frameX 
   
        if(!blocked){
            frameX = animation.Xcoordinates[position]
        }
        else{
            frameX = animation.Xcoordinates[animation.nbFrames]
        }
        
     
        DOMelement.style.backgroundPosition = `${frameX}px ${frameY}px`
    
        return ++frames
    },

    //obj = {name: , image: null, url: '.imgPath/img.jpeg or png or whatever}
    imageLoader : function(obj){
        return new Promise((res, rej) => {
          obj.image = new Image
          obj.image.onload = () => res() 
          obj.image.onerror = () => rej(new Error(`Unable to load image: ${obj.url}`))
      
          obj.image.src = obj.url
        })
      }
}




