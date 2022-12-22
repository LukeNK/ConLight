let canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const VW = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
const VH = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
canvas.width = VW;
canvas.height = VH;

// UI stuff
ctx.strokeStyle = "#ffd4d4";
ctx.fillStyle = "blue";

// Actual back-end stuff
// In all calculation, it pretends as if we are doing it at the origin
ctx.translate(VW / 2, VH / 2); // shifting the graph to center of canvas

class Point {
    /**
     * Create a point
     * @param {Number} x cord
     * @param {Number} y cord
     */
    constructor(x, y) {
        // simple class just to store point to help with calculation and stuff
        this.x = x; this.y = y;
    }
    draw() {
        let p = new Path2D();
        p.ellipse(this.x, this.y, 10, 10, 0, 0, 2 * Math.PI);
        ctx.fill(p);
    }
}

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
            this.hdg = coe.hdg; // false for left, true for right
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
     * @returns {[]} Array of graphs, inside have Point class
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
                // check requirement
                if (this.minX <= x1 && x2 <= this.maxX)
                    target.push({graph: g, p: new Point(x1 + h, m * x1 + k + g.k)});
                if (this.minX <= x2 && x2 <= this.maxX)
                    target.push({graph: g, p: new Point(x2 + h, m * x2 + k + g.k)});
            } else if (g.type == 'line') {
                // when line intersect with a line, it only have one intersect
                x1 = (g.k - this.k) / (this.m - g.m);
                if (x1 == Infinity)
                    alert('Division by zero @ Graph.intersect, please try again');
                if (this.calcFunc(x1) === false || g.calcFunc(x1) === false) continue;
                y1 = g.m * x1 + g.k;
                target.push({graph: g, p: new Point(x1, y1)});
            }
        }
        // then sort the targets, or else...
        return target;
    }
    /**
     * Find the tangent at specific point
     * @param {Point} p the point that the tangent passes through
     * @returns {Graph} the graph of the tangent
     */
    tangent(p) {
        // check to make sure only call on ellipse
        if (this.type != 'ellipse') 
            throw TypeError('Expected invoke on ellipse, got ' + this.type);
        // simplify variables
        let {a, b, h, k} = this;
        // reduce to origin
        x = p.x - h;
        y = p.y - k;
        // calculate the tangent slope thanks to Leo
        let m = -b*b * x / (a*a * y);
        // shift back
        x = x + h;
        y = y + k;
        let k1 = y - m*x;
        return new Graph('line', {m: m, k: k1})
    }
    /**
     * Only call on light, put tangent in case of ellipse
     * @param {Graph} m The graph that being selected to reflecct ON
     * @param {Point} p Point of reflection
     * @return {Graph} The reflection of n
     */
    reflect(m, p) {
        // please read the paper to make sure you got the naming convention
        let n = this; // minor reflection axis
        if (!n.light) throw TypeError('Expected invoke on light, got ' + m.type);
        if (m.type == 'ellipse') throw TypeError('Please put tangent of m');
        // perpendicular with m, pass (0,0)
        const o = new Graph('line', {m: -1/ m.m}); 
        // random point on n that approach (0,0) fro hdg
        const T = new Point((n.hdg)? -1 : 1, 0); 
        T.y = n.calcFunc(T.x);
        // m' passes through T and // with m
        const mp = new Graph('line', {m: m.m, k: -T.x * m.m + T.y}); 
        // calculate the intersect of m' and o
        const M = new Point((o.k - mp.k) / (mp.m - o.m, 0), 0); // temp store
        M.y = o.calcFunc(M.x);
        // use M and T to calculate T'
        const Tp = new Point(M.x * 2 - T.x, M.y * 2 - T.y);
        const np = new Graph('light', {m: Tp.y / Tp.x}); // TODO: GET THE REFLECTION HDG
        np.k = -p.x * np.m + p.y; // shift the reflection graph back to original equation
        return np;
    }
    /**
     * Draw out the graph
     */
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

class Level {
    /**
     * Build the level into the canvas, save and calculate necessary information
     * @param {Graph[]} objs All of the objects in the level
     * @param {Point[]} ojts All of the point (or their surrounding) that expected to come close
     * @param {Number} lightX Light original X cord
     * @param {Number} lightY Light original Y cord
     */
    constructor(objs, ojts, lightX, lightY) {
        this.objs = objs;
        for (let obj of objs) obj.draw();
        this.ojts = ojts;
        for (let ojt of ojts) ojt.draw();
    }
}