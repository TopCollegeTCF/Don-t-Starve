class DayNightSystem {
    constructor() {
        this.nightAlpha = 0;
    }
    
  update(dayTimer, dayDuration) {
        const isNight = dayTimer > dayDuration * 0.6;
        if (isNight) {
            const progress = (dayTimer - dayDuration * 0.6) / (dayDuration * 0.4);
            this.nightAlpha = Math.min(0.7, progress * 0.7);
        } else {
            this.nightAlpha = 0;
        }
    }
    
    draw(ctx) {
        if (this.nightAlpha > 0) {
            ctx.fillStyle = `rgba(0, 0, 30, ${this.nightAlpha})`;
            ctx.fillRect(0, 0, 800, 600);
            
                }
            }
        }

