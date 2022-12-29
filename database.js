const CUR_LV = {}; // current level
const LEVELS = [
    // template
    // {
    //     hint: ``,
    //     objs: [
    //         
    //     ],
    //     ojts: [
    //         new Graph('ellipse', {a: 2000, b: 2000}), // surrounded to out of bound

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
        light: {x: 0.0000000000001, y: 173.2, b: 1}
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
        light: {x: 100, y: 100, b: 1}
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
        hint: `The staircase of light, but very simple`,
        objs: [
            new Graph('ellipse', {a: 250, b: 250}),
            new Graph('line', {m: 1, k: -100}),
            new Graph('line', {m: 1, k: 100}),
        ],
        ojts: [
            new Point (175, 75),
            new Point (-25, 75),
            new Point (-25, -125),
            // new Point (-200, -120) Consider fixing light x limit first
        ],
        light: {x: 175, y: 175, b: 3}
    },
]