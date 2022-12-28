const CUR_LV = {}; // current level
const LEVELS = [
    {
        objs: [
            new Graph('ellipse', {a: 100, b: 200}),
        ],
        ojts: [
            new Point(0, -173.2)
        ],
        light: {x: 0.0000000000001, y: 173.2, b: 2}
    },
    {
        objs: [
            new Graph('ellipse', {a: 100, b: 200}),
        ],
        ojts: [
            new Point(0, -173.2),
            new Point(0, 173.2)
        ],
        light: {x: 0.0000000000001, y: 173.2, b: 3}
    },
    {
        objs: [
            new Graph('ellipse', {a: 100, b: 200}),
            new Graph('ellipse', {a: 90, b: 190}),
        ],
        ojts: [
            new Point(0, 195),
            new Point(95, 0),
            new Point(-95, 0),
        ],
        light: {x: 0.00000001, y: -195, b: 50}
    },
    {
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
        objs: [
            new Graph('ellipse', {a: 100, b: 200}),
            new Graph('line', {m: 0.000_000_000_1, k: 1}, {min: -25, max: 100})
        ],
        ojts: [
            new Point(0, -173.2),
            new Point(0, 173.2)
        ],
        light: {x: 50, y: -10, b: 4}
    },
]