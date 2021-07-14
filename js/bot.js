import { utils } from './utils.js'



export function dumbBot(bot, player){


    if(bot.animationType === 'getPunched') return

    const dist = bot.setDistance(player)
    const pos = bot.position

    let proba_left, proba_right, proba_space = 0
    let trial_space, trial_left, trial_right = false

    //Probabilité space
    if(dist < 250){
        proba_space = utils.linearProjection(100, 250, .8, .6, dist)
        trial_space = utils.probability(proba_space)
    }


    //Probabilité left
    //we want the probability to be high if far from the opponent, null if we are in contact
    if(dist < 120){
        proba_left = 0
    }
    else{
        proba_left = utils.linearProjection(120, 870, .3, .9, dist) //100 dist min, 870 dist max
        trial_left = utils.probability(proba_left)
    }

    //Probabilité right
    if(dist > 600 || pos === 780){
        proba_right = 0
    }
    else{
        proba_right = utils.linearProjection(100, 870, .9, .3, dist)
        trial_right = utils.probability(proba_right)
    }

    if(trial_space) return ' '
    if(trial_left) return 'ArrowLeft'
    if(trial_right) return 'ArrowRight'
    
}