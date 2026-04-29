// js/audio/effects.js
class EffectsManager {
    constructor() {
        // Массив активных эффектов
        this.effects = [];
    }
    
    addPickupEffect(x, y) {
        this.effects.push({
            x: x,
            y: y,
            lifetime: 0.4,      // сколько секунд живет эффект
            maxLifetime: 0.4,   // максимальное время жизни
            type: 'pickup'      // тип эффекта (золотой)
        });
        window.soundManager.play('gather');
    }
    
    addHitEffect(x, y) {
        this.effects.push({
            x: x,
            y: y,
            lifetime: 0.3,
            maxLifetime: 0.3,
            type: 'hit'         // тип эффекта (красный)
        });
        window.soundManager.play('hit');
    }
    
    update(delta) {
        // Идем с конца массива (чтобы не сбивать индексы при удалении)
        for (let i = this.effects.length - 1; i >= 0; i--) {
            // Уменьшаем время жизни
            this.effects[i].lifetime -= delta;
            
            // Если время вышло - удаляем эффект
            if (this.effects[i].lifetime <= 0) {
                this.effects.splice(i, 1);
            }
        }
    }
    
    draw(ctx, camera) {
        for (let e of this.effects) {
            // Прозрачность уменьшается со временем
            const alpha = e.lifetime / e.maxLifetime;
            // Радиус увеличивается со временем
            const radius = 20 * (1 - alpha);
            
            // Конвертируем в экранные координаты
            const screenX = e.x - camera.x;
            const screenY = e.y - camera.y;
            
            // Проверяем видимость на экране
            if (screenX + radius < 0 || screenX - radius > 800 || 
                screenY + radius < 0 || screenY - radius > 600) continue;
            
            // Выбираем цвет в зависимости от типа
            if (e.type === 'pickup') {
                ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;  // золотой
            } else {
                ctx.fillStyle = `rgba(255, 100, 100, ${alpha})`; // красный
            }
            
            // Рисуем круг
            ctx.beginPath();
            ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

window.effectsManager = new EffectsManager();
