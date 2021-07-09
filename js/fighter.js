class Fighter{
    constructor(DOMelement, side){
        this.select = DOMelement
        this.position = utils.getTranslateX(this.select) //position on the board 
        this.side = side // can be left or right ; 
        this.life = 4
/*      this.posture = 'up' //can be up or crouch ; we want to implement crouch to dodge puches  */
    }

    inRange(opponent){
        return Math.abs(this.position - opponent.position)
    }

    getPunched(opponent){
        const distance = this.inRange(opponent)
            if(distance < 5){
                this.life -= 1
            }
    }

    isDead(){
        if(this.life <= 0) return true 
    }

    //fighter cannot go out from the playground ; it cannot go throough its opponent
    move(direction, opponent){ //direction can be goLeft or goRight triggered by arrowsKeydown
        const distance = this.inRange(opponent)

        if(this.side === 'left'){
            if(direction === 'goLeft'){
                if(this.position <= 1) return
                return this.position -= 1
            }
            if(direction === 'goRight'){
                if(distance <= 5) return
                return this.position += 1
            }
        }
        if(this.side === 'right'){
            if(direction === 'goRight'){
                if(this.position >= 930) return
                return this.position += 1
            }
            if(direction === 'goLeft'){
                if(distance <= 5) return
                return this.position -= 1
            }
        }
    }

/*     crouch(){
        this.posture = "crouch"
    }

    stand(){
        this.posture = "up"
    } */
}