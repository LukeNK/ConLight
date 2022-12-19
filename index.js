let canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
// UI stuff
ctx.strokeStyle = "pink";

// Actual back-end stuff
ctx.translate(canvas.width / 2, canvas.height / 2);
// In all calculation, it pretends as if we are doing it at the origin
// When drawing, just simply shift the graph to the correct position
class Graph {
    /**
     * Create a graph will all necessary data to draw it (if needed)
     * @param {String} type The type of the graph
     * @param {Object} coe Object inclide all coefficient of the graph in standard form
     * @param {Number} minX Minimum
     * @param {Number} maxX Maximum
     */
    constructor(type, coe, minX, maxX) {
        // Depends on type of graph, choose different coefficient
        // if it is the light, still treat it as a light with origin as min max and hdg
        if (type == 'light') {
            this.type = type = 'line';
            this.light = true;
            this.hdg = coe.hdg;
            if (minX == undefined || maxX == undefined)
                throw RangeError('light must have min and max');
        } else this.type = type;
        switch (type) {
            case 'ellipse':
                this.a = coe.a; this.b = coe.b;
                this.h = coe.h || 0; this.k = coe.k || 0;
                break;
            case 'line':
            default:
                this.m = coe.m;
                this.k = coe.k || 0;
                break;
        }
        // set min and max to out of view for ease of calculation, inclusive
        this.minX = minX || -canvas.width;
        this.maxX = maxX || canvas.width;
    }
    /**
     * Calculate x to get y
     * @param {Number} x Input for the function/equation 
     * @returns {(Number[]|false)} In case of function return an array of result or false if out of bound
     */
    calcFunc(x) {
        switch (this.type) {
            case 'ellipse':
                if (!(this.minX <= x && x <= this.maxX)) return false;
                let {a, b, h, k} = this;
                let frac = (a*a - (x-h)**2)/(a*a);
                let rt = Math.sqrt(frac * b*b);
                let y1 = rt + k, y2 = -rt + k;
                return [ y1, y2 ];
            case 'line':
            default:
                if (!(this.minX <= x && x <= this.maxX)) return false;
                else return [ this.m * x - this.k ];
        }
    }
    /**
     * Determine the intersects
     * This function probably only use for light
     * INCOMPLETED
     * @param {Graph[]} graphs Array of graph to consider the intersect
     * @returns {[]} Array of graphs, inside have intersections x y
     */
    intersect(graphs) {
        // this function probably only use for the light 
        if (this.type != 'line') 
            throw TypeError('Only invoke Graph.intersect() for line!');
        let target = [];
        for (let g of graphs) {
            var x1, y1;
            if (g.type == 'ellipse') {
                let {m, k} = this, {a, b, h} = g;
                k = m*h + k - g.k;
                let e = a*a * m*m + b*b;
                let d = e - k*k;
                let rad = a * b * Math.sqrt(d);
                x1 = (-a*a * m * k + rad) / e;
                let x2 = (-a*a * m * k - rad) / e;
                target.push(
                    {graph: g, x: x1 + h, y: m * x1 + k + g.k},
                    {graph: g, x: x2 + h, y: m * x2 + k + g.k},
                )
            } else if (g.type == 'line') {
                // when line intersect with a line, it only have one intersect
                x1 = (g.k - this.k) / (this.m - g.m);
                if (x1 == Infinity)
                    alert('Division by zero @ Graph.intersect, please try again');
                if (this.calcFunc(x1) === false || g.calcFunc(x1) === false) continue;
                y1 = g.m * x1 + g.k;
                target.push({graph: g, x: x1, y: y1});
            }
        }
        // then sort the targets, or else...
        return target;
    }
    /**
     * Find the tangent at specific point
     * @param {Number} x X cord
     * @param {Number} y Y cord
     * @returns {Graph} the graph of the tangent
     */
    tangent(x, y) {
        // check to make sure only call on ellipse
        if (this.type != 'ellipse') 
            throw TypeError('Expected invoke on ellipse, got ' + this.type);
        // simplify variables
        let {a, b} = this;
        x = x - this.h;
        y = y - this.k;
        // calculate the tangent slope thanks to Leo
        let m = -b*b * x / (a*a * y); // SLOPE IS THE PROBLEM
        x = x + this.h;
        y = y + this.k;
        let k = y - m*x;
        return new Graph('line', {m: m, k: k})
    }
    draw() {
        switch (this.type) {
            case 'ellipse':
                ctx.beginPath();
                ctx.ellipse(this.h, this.k, this.a, this.b, 0, 0, Math.PI * 2);
                ctx.stroke();
                break;
            case 'line':
            default:
                // calculate k after transformation for drawing
                // then min max in the canvas instead of graph
                ctx.beginPath();
                ctx.moveTo(this.minX, this.m * this.minX + this.k);
                ctx.lineTo(this.maxX, this.m * this.maxX + this.k);
                ctx.stroke();
                break;
        }
    }
}

let l1 = new Graph('line', {m: 2, k : 50}),
    l2 = new Graph('line', {m: -2, k : 0}),
    l3 = new Graph('ellipse', {a: 100, b: 200, h: 50, k: 50})
let inter = l1.intersect([l3])[0];
l3.tangent(inter.x, inter.y).draw();
console.log(inter);
let l4 = new Graph('ellipse', {a: 10, b: 10, h: inter.x, k: inter.y});
new Graph('ellipse', {a: 10, b: 10, h: 0, k: 0}).draw()
l1.draw(); l2.draw(); l3.draw(); l4.draw();
new Graph('ellipse', {a: 100, b: 200, h: 0, k: 0}).draw();