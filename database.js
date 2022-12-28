const CUR_LV = {}; // current level
const LEVELS = [
    {
        objs: [
            new Graph('ellipse', {a: 100, b: 200}),
            // new Graph('ellipse', {a: 90, b: 190}),
            new Graph('line', {m: 1}, {min: -75, max: 100})          
        ],
        ojts: [
            new Point(0, 195),
            new Point(95, 0),
        ],
        light: {x: 0.00000001, y: -195, b: 100}
    },
]