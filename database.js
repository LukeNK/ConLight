const CUR_LV = {}; // current level
const LEVELS = [
    {
        focus: [],
        objs: [
            new Graph('line', {m: 2, k : 100}),
            new Graph('line', {m: -2, k : 0}),
            new Graph('ellipse', {a: 100, b: 200, h: 50, k: 50}),
            
        ],
        ojts: [
            new Point(0, 0)
        ],
        light: {x: 50, y: 50, b: 10}
    },
]