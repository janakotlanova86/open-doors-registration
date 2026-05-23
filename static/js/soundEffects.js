/**
 * Web Audio API Sound Synthesizer
 * Generuje zvukové efekty přímo v prohlížeči bez nutnosti načítat externí MP3 soubory.
 * Skvělé pro offline spuštění a jako ukázka pokročilého využití Web API v práci.
 */

const SoundEffects = {
    // Kontext se vytvoří až při prvním uživatelském kliknutí (bezpečnostní politika prohlížečů)
    audioCtx: null,

    init() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    },

    /**
     * Přehrání úspěšného tónu (dvojité vysoké pípnutí jako u pokladny)
     */
    playSuccess() {
        try {
            this.init();
            const now = this.audioCtx.currentTime;
            
            // První pípnutí
            const osc1 = this.audioCtx.createOscillator();
            const gain1 = this.audioCtx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(1000, now); // 1000 Hz
            gain1.gain.setValueAtTime(0.1, now);
            gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc1.connect(gain1);
            gain1.connect(this.audioCtx.destination);
            osc1.start(now);
            osc1.stop(now + 0.1);

            // Druhé pípnutí s mírným zpožděním
            const osc2 = this.audioCtx.createOscillator();
            const gain2 = this.audioCtx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1400, now + 0.08); // 1400 Hz
            gain2.gain.setValueAtTime(0.1, now + 0.08);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc2.connect(gain2);
            gain2.connect(this.audioCtx.destination);
            osc2.start(now + 0.08);
            osc2.stop(now + 0.2);
        } catch (e) {
            console.warn("Nepodařilo se přehrát zvuk úspěšného odbavení:", e);
        }
    },

    /**
     * Přehrání chybového tónu (nízké zabzučení)
     */
    playError() {
        try {
            this.init();
            const now = this.audioCtx.currentTime;
            
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            
            osc.type = 'sawtooth'; // Pila pro drsnější zvuk
            osc.frequency.setValueAtTime(120, now); // 120 Hz
            
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
            
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            
            osc.start(now);
            osc.stop(now + 0.35);
        } catch (e) {
            console.warn("Nepodařilo se přehrát zvuk chyby:", e);
        }
    }
};
