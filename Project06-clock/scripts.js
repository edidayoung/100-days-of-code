class WallClock {
  constructor() {
    this.hourHand = document.querySelector('.hour-hand');
    this.minuteHand = document.querySelector('.minute-hand');
    this.secondHand = document.querySelector('.second-hand');
    this.digitalTime = document.getElementById('digitalTime');
    this.tickToggle = document.getElementById('tickToggle');
    this.timezoneSelect = document.getElementById('timezoneSelect');

    this.tickingEnabled = false;
    this.lastSecond = -1;
    this.selectedZone = 'Africa/Lagos';

    this.createTickSound();
    this.setupControls();
    this.createMinuteMarks();
    this.setupClockInteractions();
    this.updateClock();

    setInterval(() => this.updateClock(), 1000);
  }

  createTickSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.tickSound = () => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(850, audioCtx.currentTime);
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.07);
    };
  }

  setupControls() {
    const zones = {
      'Africa/Lagos': '🇳🇬 Lagos',
      'Europe/London': '🇬🇧 London',
      'America/New_York': '🇺🇸 New York',
      'Asia/Tokyo': '🇯🇵 Tokyo',
      'Europe/Paris': '🇫🇷 Paris',
      'Asia/Dubai': '🇦🇪 Dubai'
    };

    for (const [value, label] of Object.entries(zones)) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      this.timezoneSelect.appendChild(option);
    }

    this.timezoneSelect.value = this.selectedZone;

    this.timezoneSelect.addEventListener('change', (e) => {
      this.selectedZone = e.target.value;
      this.updateClock();
    });

    // Toggle button
    this.tickToggle.addEventListener('click', () => {
      this.tickingEnabled = !this.tickingEnabled;
      this.tickToggle.classList.toggle('active');
      this.tickToggle.textContent = this.tickingEnabled ? '🔊 ON' : '🔇 OFF';
    });
  }

  updateClock() {
    const now = new Date();
    const zoned = new Date(now.toLocaleString('en-US', { timeZone: this.selectedZone }));

    const h = zoned.getHours();
    const m = zoned.getMinutes();
    const s = zoned.getSeconds();

    this.hourHand.style.transform = `translateX(-50%) rotate(${(h % 12 + m / 60) * 30}deg)`;
    this.minuteHand.style.transform = `translateX(-50%) rotate(${(m + s / 60) * 6}deg)`;
    this.secondHand.style.transform = `translateX(-50%) rotate(${s * 6}deg)`;

    if (this.tickingEnabled && s !== this.lastSecond) {
      this.tickSound();
    }
    this.lastSecond = s;

    const ampm = h >= 12 ? 'PM' : 'AM';
    const hr12 = h % 12 || 12;
    this.digitalTime.textContent = `${String(hr12).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} ${ampm}`;
  }

  createMinuteMarks() {
    const container = document.querySelector('.minute-marks');
    for (let i = 0; i < 60; i++) {
      if (i % 5 !== 0) {
        const mark = document.createElement('div');
        mark.className = 'minute-mark';
        mark.style.position = 'absolute';
        mark.style.width = '100%';
        mark.style.height = '100%';
        mark.style.transform = `rotate(${i * 6}deg)`;
        mark.innerHTML = `<div style="
          position:absolute;top:10px;left:50%;
          width:2px;height:8px;
          background:#7f8c8d;
          transform:translateX(-50%);
        "></div>`;
        container.appendChild(mark);
      }
    }
  }

  setupClockInteractions() {
    const clock = document.querySelector('.clock');
    clock.addEventListener('mouseenter', () => {
      clock.style.transform = 'scale(1.05)';
    });
    clock.addEventListener('mouseleave', () => {
      clock.style.transform = 'scale(1)';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => new WallClock());
