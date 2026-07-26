import confetti from 'canvas-confetti';

export function fireConfetti() {
  confetti({
    particleCount: 90,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#E69F00', '#56B4E9', '#009E73', '#0072B2', '#CC79A7'],
  });
}

export function fireBigConfetti() {
  confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
  setTimeout(() => confetti({ particleCount: 100, spread: 120, origin: { y: 0.6 } }), 250);
}
