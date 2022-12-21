const CUR_LV = {}; // current level
const LEVELS = [
    {
        focus: [],
        objs: [
            new Graph('line', {m: 2, k : 50}),
            new Graph('line', {m: -2, k : 0}),
            new Graph('ellipse', {a: 100, b: 200, h: 50, k: 50}),
            new Point(0, 0)
        ],
        levelInit: () => {
            let l1 = new Graph('line', {m: 2, k : 50}),
                l2 = new Graph('line', {m: -2, k : 0}),
                l3 = new Graph('ellipse', {a: 100, b: 200, h: 50, k: 50})
            let inter = l1.intersect([l3])[0];
            l3.tangent(inter.x, inter.y).draw();
            let l4 = new Graph('ellipse', {a: 10, b: 10, h: inter.x, k: inter.y});
            new Graph('ellipse', {a: 10, b: 10, h: 0, k: 0}).draw()
            l1.draw(); l2.draw(); l3.draw(); l4.draw();
            new Graph('ellipse', {a: 100, b: 200, h: 0, k: 0}).draw();
        }
    },
    {
        ojts: [
            
        ]
    },
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
]