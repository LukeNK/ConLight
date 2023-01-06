const CUR_LV = {}; // current level
const LEVELS = [
    // template
    // {
    //     hint: ``,
    //     objs: [
    //         new Graph('ellipse', {a: 2000, b: 2000}), // surrounded to out of bound
    //     ],
    //     ojts: [
    //     ],
    //     light: {x: 50, y: 0, b: 3}
    // },
    {
        hint: 'The objective of this game is to get the light beam through all of the target. Move the slider at the bottom of the screen to change the launch direction of the light.',
        objs: [
            new Graph('ellipse', {a: 100, b: 200}),
        ],
        ojts: [
            new Point(0, -173.2)
        ],
        light: {x: 0.0000000000001, y: 173.2, b: 1},
    },
    {
        hint: 'The ellipse have one special property for light: if it light hit one foci, it will eventually bounce back and hit the other one',
        objs: [
            new Graph('ellipse', {a: 100, b: 200}),
        ],
        ojts: [
            new Point(0, -173.2),
            new Point(0, 173.2)
        ],
        light: {x: 0.0000000000001, y: 173.2, b: 2}
    },
    {
        hint: "You have to get the objectives in order. If you accidentally hit one before its turn, it won't count. You can skip bounce animation by clicking bounce button multiple times.",
        objs: [
            new Graph('ellipse', {a: 100, b: 200}),
            new Graph('ellipse', {a: 90, b: 190}),
        ],
        ojts: [
            new Point(0, 195),
            new Point(95, 0),
            new Point(-95, 0),
        ],
        light: {x: 0.00000001, y: -195, b: 100},
    },
    {
        hint: `PARABOLA! My old enemy! When the light come into the parabola directly, it will always bounce to the focus.`,
        objs: [
            new Graph('ellipse', {a: 250, b: 1000, k: 750}),
            new Graph('line', {m: -1}, {min: -250, max: 75})
        ],
        ojts: [
            new Point(0, -218.25),
        ],
        light: {x: 100, y: 100, b: 1},
        win: () => {console.log('je')}

    },
    {
        hint: "This level is for those who didn't listen to Ms. Liu, Mr. Liu, or read the game hint.",
        objs: [
            new Graph('ellipse', {a: 100, b: 200}),
        ],
        ojts: [
            new Point(0, -173.2),
            new Point(0, 173.2)
        ],
        light: {x: 50, y: 0, b: 3}
    },
    {
        hint: 'Sometimes all you need to do is follow the wall',
        objs: [
            new Graph('ellipse', {a: 100, b: 200}),
        ],
        ojts: [
            new Point(0, 195),
            new Point(95, 0),
        ],
        light: {x: 0.00000001, y: -195, b: 10}
    },
    {
        hint: 'Sometimes you have to think a part of the ellipse is a parabola',
        objs: [
            new Graph('ellipse', {a: 100, b: 200}),
            new Graph('line', {m: 0.000_000_000_1, k: 1}, {min: -25, max: 101}),
            new Graph('line', {m: -5, k: 1}, {min: -1, max: 30})
        ],
        ojts: [
            new Point(0, -173.2),
            new Point(0, 173.2)
        ],
        light: {x: 50, y: -10, b: 3}
    },
    {
        hint: `There is a gap, but can you abuse it?`,
        objs: [
            new Graph('ellipse', {a: 100, b: 200}),
            new Graph('line', {m: -0.00001, k: 0}, {min: -100, max: -10}),
            new Graph('line', {m: -0.00001, k: 0}, {min: 10, max: 100}),
        ],
        ojts: [
            new Point (-95, 0),
            new Point(0, 173.2),
            new Point(0, -150)
        ],
        light: {x: 0.0000000001, y: -173.2, b: 4}
    },
    {
        hint: "NUMBER FOUR!",
        objs: [
            new Graph('ellipse', {a: 149, b: 303, h: -1, k: 28}),
            new Graph('ellipse', {a: 34, b: 200, h: -45, k: 90})
        ],
        ojts: [
            new Point(66, -171),
            new Point(-129, -38),
            new Point(-111, 174),
            new Point(92, 166),
        ],
        light: {x: 0.0000000001, y: 0.0000001, b: 40}
    },
    {
        hint: "Have fun and prepare for the final level!",
        objs: [
            new Graph('ellipse', {a: 123, b: 317, h: 0, k: 19}),
        ],
        ojts: [
            new Point(-102 + 107, -188),
            new Point(-14 + 107, 201),
            new Point(-209 + 107, -135),
            new Point(-102 + 107, 325),
        ],
        light: {x: 0.0000000001, y: 0.0000001, b: 1000}
    },
    {
        hint: "BOSS LEVEL <br> However, Luke does make some mistake when programming, so can you exploit it?",
        objs: [
            new Graph('ellipse', {a: 101, b: 171, h: -1, k: 19}),
            new Graph('ellipse', {a: 331, b: 51, h: -10, k: 500}),
            new Graph('line', {m: 0.463, k: -78}),
            new Graph('line', {m: -0.068, k: 470}),
            new Graph('line', {m: -0.156, k: 500}),
            new Graph('line', {m: 0.021, k: -500})
        ],
        ojts: [
            new Point(66, -73),
            new Point(-41, 59),
            new Point(-41,130),
            new Point(48,  15)
        ],
        light: {x: 0.00001, y: 0.000001, b: 1000}
    }, {
        // empty level for something *special*
    }
]