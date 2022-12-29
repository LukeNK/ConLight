let canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const {PI, sqrt} = Math;
const HIT_TOLERANCE = 15; // basically the maximum before it out of "hit"

let ALL_TIMEOUT = []; // all reset

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
        ctx.fillStyle = "#FE5F55";
        let p = new Path2D();
        p.ellipse(this.x, this.y, 10, 10, 0, 0, 2 * PI);
        ctx.fill(p);
    }
}

class Graph {
    /**
     * Create a graph will all necessary data to draw it (if needed)
     * @param {String} type The type of the graph
     * @param {Object} coe Object inclide all coefficient of the graph in standard form
     * @param {Object} X Min and Max X
     * @param {Object} Y Min and Max Y
     */
    constructor(type, coe, X, Y) {
        // Depends on type of graph, choose different coefficient
        // if it is the light, still treat it as a light with origin as min max and hdg
        if (type == 'light') {
            this.type = type = 'line';
            this.light = true;
            this.x = coe.x; this.y = coe.y; // light origin
            this.hdg = coe.hdg; // heading in radian
            if (coe.k == undefined) 
                coe.k = - coe.x * coe.m + coe.y;
            X = X || {}; // create placeholder
            Y = Y || {};
            if (this.lightPositiveX(coe.hdg)) X.min = this.x; else X.max = this.x;
            if (this.lightPositiveY(coe.hdg)) Y.min = this.y; else Y.max = this.y;
            this.maxBounce = coe.maxBounce;
            this.bounce = coe.bounce || 0; // total number of ALREADY bounced
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
        this.minX = X?.min || -canvas.width;
        this.maxX = X?.max || canvas.width;
        // consider Y AFTER X
        this.minY = Y?.min || -canvas.height;
        this.maxY = Y?.max || canvas.height;
    
    }
    lightPositiveX(rad) {
        if (PI/2 < rad && rad < 1.5 * PI) return false; else return true;
    }
    lightPositiveY(rad) {
        if (0 < rad && rad < PI) return true; else return false;
    }
    /**
     * Calculate x to get y
     * @param {Number} x Input for the function/equation 
     * @param {true} n DON'T Check requirement
     * @returns {(Number[]|false)} In case of function return an array of result or false if out of bound
     */
    calcFunc(x, n) {
        switch (this.type) {
            case 'ellipse':
                if (!n && !(this.minX <= x && x <= this.maxX)) return false;
                let {a, b, h, k} = this;
                let frac = (a*a - (x-h)**2)/(a*a);
                let rt = sqrt(frac * b*b);
                let y1 = rt + k, y2 = -rt + k;
                return [ y1, y2 ];
            case 'line':
            default:
                if (!n && !(this.minX <= x && x <= this.maxX)) return false;
                else return [ this.m * x + this.k ];
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
                let rad = a * b * sqrt(d);
                x1 = (-a*a * m * k + rad) / e;
                let x2 = (-a*a * m * k - rad) / e;
                // check requirement
                if (this.calcFunc(x1 + h).length)
                    target.push({graph: g, p: new Point(x1 + h, m * x1 + k + g.k)});
                if (this.calcFunc(x2 + h).length)
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
        let x = p.x - h,
            y = p.y - k;
        // calculate the tangent slope thanks to Leo
        let m = -b*b * x / (a*a * y);
        // shift back
        x = x + h;
        y = y + k;
        let k1 = y - m*x;
        return new Graph('line', {m: m, k: k1});
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
        if (m.type == 'ellipse') {
            // assume p is the actual intersect
            m = m.tangent(p);
        }
        // strip off to make all calculation at origin, but store it temp
        n.kt = n.k; m.kt = m.k;
        n.k = 0; m.k = 0;
        // perpendicular with m, pass (0,0)
        const o = new Graph('line', {m: -1 / m.m}); 
        // random point on n that approach (0,0) from hdg
        const T = new Point(0, 0); // placeholder
        T.x = (this.lightPositiveX(n.hdg))? -1 : 1;
        T.y = n.calcFunc(T.x, true)[0];
        // m' passes through T and // with m
        const mp = new Graph('line', {m: m.m, k: -T.x * m.m + T.y}); 
        // calculate the intersect of m' and o
        const M = new Point((o.k - mp.k) / (mp.m - o.m), 0); // temp store
        M.y = o.calcFunc(M.x, true)[0];
        // use M and T to calculate T'
        const Tp = new Point(M.x * 2 - T.x, M.y * 2 - T.y);
        // get the reflect heading base on T'
        let npHdg;
        (() => {
            let {PI, atan} = Math;
            if (Tp.x < 0){
                npHdg = atan(Tp.y / Tp.x) + PI;
            } else 
                npHdg = atan(Tp.y / Tp.x);
        })();
        const np = new Graph('light', {
            m: Tp.y / Tp.x, 
            hdg: npHdg,
            x: p.x, y: p.y, 
            maxBounce: this.maxBounce,
            bounce: this.bounce + 1
        });
        // return reference back to original value
        n.k = n.kt; m.k = m.kt;
        return np;
    }
    /**
     * Calculate distance of a line to a point
     * @param {Point} p The point to check distance
     * @returns {Number|Infinity} Return distance, or Infitity if udf
     */
    distanceFromPoint(p) {
        if (this.type != 'line') 
            throw TypeError('Only invoke distance on line')
        let m = this;
        // find perpendicular pass through p
        let n = new Graph('line', {m: -1 / m.m});
        n.k = p.y - p.x * n.m;
        // intersect of m and n
        let i = m.intersect([n])[0]?.p;
        // if the selected point is out of range
        if (i == undefined || m.calcFunc(i.x) == false) return Infinity;
        // find the distancec between two points
        return sqrt((p.x - i.x)**2 + (p.y - i.y)**2);
    }
    /**
     * Draw out the graph
     * @returns {Graph} Return for chaining
     */
    draw() {
        if (this.light) { 
            ctx.strokeStyle = "#edf67d";
            ctx.lineWidth = 5;
            // change the width
            ctx.lineWidth = 
                ctx.lineWidth * (this.maxBounce - this.bounce + 1) / (this.maxBounce + 1);            
        } else {
            ctx.strokeStyle = "#ffd4d4";
            ctx.lineWidth = 1.5;
        }
        switch (this.type) {
            case 'ellipse':
                ctx.beginPath();
                ctx.ellipse(this.h, this.k, this.a, this.b, 0, 0, PI * 2);
                ctx.stroke();
                break;
            case 'line':
            default:
                // calculate k after transformation for drawing
                // then min max in the canvas instead of graph
                ctx.beginPath();
                ctx.moveTo(this.minX, this.calcFunc(this.minX)[0]);
                ctx.lineTo(this.maxX, this.m * this.maxX + this.k);
                ctx.stroke();
                break;
        }
        return this; // returnfor chaining
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
    constructor(objs, ojts, light) {
        this.stopLevel(); // completely stop level just in case
        // copy for objs and ojts manipulation
        this.objs = [...objs];
        this.ojts = [...ojts];
        this.draw();
        // light temp store for launchLight()
        this.light = {}
        this.light.x = light.x; 
        this.light.y = light.y; 
        this.light.b = light.b; // max light bounce
        // last intercept
        this.lastInter = undefined;
    }
    launchLight(hdg) {
        let {tan} = Math;
        this.light = new Graph('light', {
            m: tan(hdg), 
            hdg: hdg, 
            x: this.light.x, y: this.light.y,
            maxBounce: this.light.b
        });
    }
    /**
     * Bounce light chain function
     * @param {true} pre If true, then this is only preview
     * @returns 
     */
    bounceLight(pre) {
        // no more bounce
        if (this.light.bounce > this.light.maxBounce) 
            return this.stopLevel();
        // update bounce count UI
        document.getElementById('bCount').innerHTML = 
            `${this.light.bounce}/${this.light.maxBounce} bounce`;
        // find closest intersect
        let intersects = this.light.intersect(this.objs);
        let interLength = [], 
            minL = Infinity, // min length
            minI = undefined; // min index
        for (let l1 in intersects) {
            let {x, y} = intersects[l1].p;
            let xo = this.light.x, yo = this.light.y;
            let l = sqrt((x - xo)**2 + (y - yo)**2)
            if (l <= 1) l = Infinity; // weird floating point
            if (l < minL) { minL = l; minI = l1; }
            interLength.push(l);
        }
        minL = Infinity, minI = undefined; // reset to select the second
        for (let l1 in interLength) {
            let l = interLength[l1];
            if (l < minL) { minL = l; minI = l1; }
        }
        // assign the selected intersect
        this.lastInter = intersects[minI];
        // reduce the domain to intercept for drawing
        if (this.light.minX == -canvas.width)
            this.light.minX = intersects[minI].p.x;
        else this.light.maxX = intersects[minI].p.x;
        // change y range to the intercept
        if (this.light.minY == -canvas.height)
            this.light.minY = intersects[minI].p.y;
        else this.light.maxY = intersects[minI].p.y;
        // check if the CURRENT light hit planed target
        if (!pre)
            if (this.light.distanceFromPoint(this.ojts[0]) < HIT_TOLERANCE
            ) {
                this.ojts.splice(0, 1);
                this.draw();
            };
        this.light.draw(); // draw current light
        // if this is a preview, return max min to original, else assign reflect
        if (pre) {
            if (this.light.minX == intersects[minI].p.x)
                this.light.minX = -canvas.width;
            else this.light.maxX = canvas.width;
            if (this.light.minY == intersects[minI].p.y)
                this.light.minY = -canvas.height;
            else this.light.maxY = canvas.height;
        } else if (this.ojts.length) {
            document.getElementById('bounceBtn').innerHTML = 'Skip';
            this.light = 
                this.light.reflect(intersects[minI].graph, intersects[minI].p);
            ALL_TIMEOUT.push(
                setTimeout(() => {this.bounceLight()}, 250)
            );
        }
    }
    draw() {
        // clean the canvas
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        canvasSize(); // restart canvas size
        // draw objects and objectives
        for (let obj of this.objs) obj.draw();
        for (let l1 in this.ojts) {
            let ojt = this.ojts[l1];
            ojt.draw();
            ctx.font = "48px verdana";
            ctx.fillStyle = 'white';
            ctx.fillText(parseInt(l1) + 1, ojt.x, ojt.y);
        }
    }
    stopLevel() {
        for (let timeout of ALL_TIMEOUT)
            clearTimeout(timeout);
        ALL_TIMEOUT = [];
        document.getElementById('bounceBtn').innerHTML = 'Bounce';
    }
}