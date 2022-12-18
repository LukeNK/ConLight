let canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
// UI stuff
ctx.strokeStyle = "red";

// Actual back-end stuff
ctx.translate(canvas.width / 2, canvas.height / 2)

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
        this.type = type;
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
        // set min and max to out of view for ease of calculation
        this.minX = minX || -canvas.width;
        this.maxX = maxX || canvas.width;
    }
    /**
     * Calculate x to get y
     * @param {Number} x Input for the function/equation 
     * @returns {(Number|Number[])} In case of function, return a number, else return an array of result
     */
    calcFunc(x) {
        switch (this.type) {
            case 'ellipse':
                let inside = (a*a - x*x) / a*a * b*b
                return [+Math.sqrt(inside), -Math.sqrt(inside)]
            case 'line':
            default:
                return this.m*x-this.k;
        }
    }
    /**
     * Determine the closest graph that intersected closest to the point
     * This function probably only use for the light
     * INCOMPLETED
     * @param {Graph[]} graphs Array of graph to consider the intersect
     * @param {Number} x
     * @param {Number} y
     * @returns {Graph} 
     */
    intersect(graphs, x, y) {
        // go through the list of all other graphs to determine which are being intersected
        // closet to the point, return none if there is... none
        // this function probably only use for the light 
        let target = undefined,
            smallestD = Infinity;
        for (let g of graphs) {
            if (g.type == 'ellipse') {
                    // INCOMPLETED
            } else if (g.type == 'line') {
                // when line intersect with a line, it only have one intersect
                var x1 = (g.k - this.k) / (this.m - g.m);
                if (x == Infinity) {alert('Division by zero @ Graph.intersect, please try again')}
                var y1 = g.m * x + g.k;
            }
            // TODO: TEST THIS SECTION
            let distance = Math.sqrt((x1 - x)**2 + (y1 - y)**2);
            if (distance <= smallestD) {
                smallestD = distance;
                target = g;
            }
        }
        return target; // consider return graph AND the intersection
    }
    tangent(x, y) {
        // check to make sure only call on ellipse
        if (this.type != 'ellipse') 
            throw TypeError('Expected invoke on ellipse, got ' + this.type);
        // calculate the tangent slope thanks to Leo
        let m = (b*b / a*a)*(x, y),
            c = y-m*x;
        return new Graph('line', {m: m, c: c})
    }
    draw() {
        switch (this.type) {
            case 'ellipse':
                ctx.beginPath()
                ctx.ellipse(this.h, this.k, this.a, this.b, 0, 0, Math.PI * 2);
                ctx.stroke()
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