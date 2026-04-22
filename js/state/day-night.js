class DayNightSystem {
    constructor() {
        this.nightAlpha = 0;
        this.stars = [];
    }
      initStars() {
        this.stars = [];
        for (let i = 0; i < 50; i++) {
            this.stars.push({ x: Math.random() * 800, y: Math.random() * 600 });
        }
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
            
            if (this.nightAlpha > 0.3 && this.stars.length > 0) {
                for (let star of this.stars) {
                    ctx.fillStyle = `rgba(255,255,200,${this.nightAlpha * 0.8})`;
                    ctx.fillRect(star.x, star.y, 2, 2);
                }
            }
        }
    }
}
