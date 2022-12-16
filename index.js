const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.ellipse(100, 100, 100, 75, 0, 0, 2 * Math.PI);
ctx.stroke();