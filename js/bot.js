import { utils } from './utils.js'

let punches = 0

export function dumbBot(bot, player, started){

    const dist = bot.setDistance(player)
    const pos = bot.position

    let proba_left, proba_right, proba_space = 0
    let trial_space, trial_left, trial_right = false

    //We're not making him imba, we limit the number to puches in a row to 3
    // After a 3 punches in a row super combo the BOT retreats 
    if(punches >= 3){
        punches = 0
        return 'ArrowRight' 
    } 

    /* Punch Probability */
    //The BOT is not that dumb, he won't throw punches if he's too far from his target (dist < 250)
    //If he is super close to the target, not cornered and don't feel like fighting, he'll retreat
    if(dist < 250){
        proba_space = utils.linearProjection(100, 250, .8, .6, dist)
        trial_space = utils.probability(proba_space)

        if(dist < 150 && !trial_space && pos < 870) return 'ArrowRight'
    }


    /* Going left probability */
    //we want the probability to be high if far from the target, null if they are in touch
    //The bot is respectfull. Before the game starts, the BOT can move to show he is ready to fight, but won't go to close to the target. 
    //The bot isn't too dumb, if he's close to his target he won't try to go any further
    if(dist < 120 || (!started && pos <= 400)){
        proba_left = 0
    }
    else{
        proba_left = utils.linearProjection(120, 870, .3, .9, dist) //100 dist min, 870 dist max
        trial_left = utils.probability(proba_left)
    }

    /* Going right probability */
    //The BOT isn't a chicken, if he's very far from his target he won't try to flee 
    //The closer he gets to his target the more he can consider take a step back
    if(dist > 600 || pos > 780){
        proba_right = 0
    }
    else{
        proba_right = utils.linearProjection(100, 870, .9, .3, dist)
        trial_right = utils.probability(proba_right)
    }

    /* Priorities */
    //If he feels like punching, he doesn't think much, he puches !
    //Else he would rather prefer to be aggressive going foward his opponent than showing he is a little bit scare stepping back
    if(trial_space){
        punches++
        return ' '
    } 
    if(trial_left) return 'ArrowLeft'
    if(trial_right) return 'ArrowRight'
    
}