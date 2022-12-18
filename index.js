let canvas = document.getElementById('canvas');
canvas.h = canvas.width / 2; // canvas shift
canvas.k = canvas.height / 2; 
const ctx = canvas.getContext('2d');

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
    tangent(x, y) {
        // check to make sure only call on ellipse
        if (this.type != 'ellipse') 
            throw TypeError('Expected invoke on ellipse, got ' + this.type);
        // calculate the tangent slop thanks to Leo
        let m = (b*b / a*a)*(x, y),
            c = y-m*x;
        return new Graph('line', {m: m, c: c})
    }
    draw() {
        switch (this.type) {
            case 'ellipse':
                ctx.beginPath()
                ctx.ellipse(this.h + canvas.h, this.k + canvas.k, this.a, this.b, 0, 0, Math.PI * 2)
                ctx.stroke()
                break;
            case 'line':
            default:
                let k = -this.m * canvas.h + this.k + canvas.k;
                ctx.beginPath();
                let minX = this.minX + canvas.h,
                    maxX = this.maxX + canvas.h;
                ctx.moveTo(minX, this.m * minX + k);
                ctx.lineTo(maxX, this.m * maxX + k);
                ctx.stroke();
                break;
        }
    }
}