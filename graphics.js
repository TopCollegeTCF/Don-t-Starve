window.drawTreeSides = function(ctx, x, y) {
    ctx.fillStyle = 'green';
    
    ctx.beginPath();
    ctx.arc(x - 10, y - 20, 12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + 10, y - 20, 12, 0, Math.PI * 2);
    ctx.fill();
}
window.drawTree = function(ctx, x, y) {
    window.drawTreeTrunk(ctx, x, y);
    window.drawTreeTop(ctx, x, y);
    window.drawTreeSides(ctx, x, y);
}
