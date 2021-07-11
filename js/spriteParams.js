export const spriteParams = [
    {
        name: 'idle',
        nbFrames: 4,
        frameWidth: 300,
        frameHeight: 450,
        Ycoordinates: 0,
        Xcoordinates: [ 
            0, 
            -300, 
            -600, 
            -900
        ]
    },
    {
        name: 'walk',
        nbFrames: 5,
        frameWidth: 300,
        frameHeight: 450,
        Ycoordinates: -450,
        Xcoordinates: [
            0,
            -300,
            -600,
            -900,
            -1200
        ]
    },
    {
        name: 'punch',
        nbFrames: 5,
        frameWidth: 300,
        frameHeight: 450,
        Ycoordinates: -900,
        Xcoordinates: [
            0,
            -300,
            -600,
            -900,
            -1200
        ]
    },
    {
        name: 'crouch',
        nbFrames: 2,
        frameWidth: 300,
        frameHeight: 450,
        Ycoordinates: -1350,
        Xcoordinates: [
            0, 
            -300
        ]
    },
    {
        name: 'getPunched',
        nbFrames: 4,
        frameWidth: 300,
        frameHeight: 450,
        Ycoordinates: -1800,
        Xcoordinates: [
            0, 
            -300, 
            -600, 
            -900
        ]
    },
    {
        name: 'victory',
        nbFrames: 3,
        frameWidth: 300,
        frameHeight: 450,
        Ycoordinates: -2250,
        Xcoordinates: [
            0,
            -300,
            -600
        ]
    },
    {
        name: 'hit',
        nbFrames: 3,
        frameWidth: 100,
        frameHeight: 100,
        Ycoordinates: 0,
        Xcoordinates: [
            0,
            -100,
            -200
        ]
    }
]
