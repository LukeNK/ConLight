let canvas = document.getElementById('canvas');
canvas.h = canvas.width / 2; // canvas shift
canvas.k = canvas.height / 2; 
const ctx = canvas.getContext('2d');

// In all calculation, it pretends as if we are doing it at the origin and stuff. When drawing, just simply shift the graph to the correct position and flip it
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
                this.h = coe.h; this.k = coe.k;
                break;
            case 'line':
            default:
                this.m = coe.m;
                this.k = coe.k;
                break;
        }
        // set min and max to out of view for ease of calculation
        this.minX = minX || -canvas.width;
        this.maxX = maxX || canvas.width;
    }
    calcFunc(x) {
        // calculate function
        switch (this.type) {
            case 'line':
            default:
                return this.m*x-this.k;
                break;
        }
    }
    tangent(x, y) {
        // check to make sure only call on ellipse
        if (this.type != 'ellipse') 
            throw TypeError('Expected invoke on ellipse, got ' + this.type);
        // calculate the tangent slop thanks to Leo
        let m = (b*b / a*a)*(x, y);
        let c = y-m*x;
        return new Graph('line', {m: m, c: c})
    }
    draw() {
        switch (this.type) {
            case 'ellipse':
                
                break;
            
            case 'line':
            default:
                let k = -this.m * canvas.h + this.k + canvas.k;
                ctx.beginPath();
                ctx.moveTo(0, k)
                ctx.lineTo(canvas.width, this.m * canvas.width + k);
                ctx.stroke()
                break;
        }
    }
}
