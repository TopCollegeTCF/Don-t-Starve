// Функция для полного эффекта подбора
window.drawPickupEffect = function(ctx, x, y) {
    // TODO: Вызвать обе функции искр
    window.drawVerticalSparks(ctx, x, y);
    window.drawHorizontalSparks(ctx, x, y);
    
    // Бонус: добавить маленькие кружки на концах
    ctx.fillStyle = 'yellow';
    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI / 2);
        const sparkX = x + Math.cos(angle) * 20;
        const sparkY = y + Math.sin(angle) * 20;
        
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}
