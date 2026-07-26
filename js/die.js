// Laudalla pyörivä 3D-noppa. Noppa heitetään pelaajan nappulan vierestä,
// pyörii ilmassa ja jää lepäämään kartalle seuraavaan heittoon asti.

const PIPS = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

// Kuution tahkot: 1 edessä, 6 takana, 3 oikealla, 4 vasemmalla, 2 ylhäällä, 5 alhaalla.
const FACES = [
  { value: 1, transform: 'translateZ(var(--half))' },
  { value: 6, transform: 'rotateY(180deg) translateZ(var(--half))' },
  { value: 3, transform: 'rotateY(90deg) translateZ(var(--half))' },
  { value: 4, transform: 'rotateY(-90deg) translateZ(var(--half))' },
  { value: 2, transform: 'rotateX(90deg) translateZ(var(--half))' },
  { value: 5, transform: 'rotateX(-90deg) translateZ(var(--half))' },
];

// Kierto, jolla haluttu silmäluku kääntyy katsojaa kohti.
const FACE_ROTATION = {
  1: [0, 0],
  2: [-90, 0],
  3: [0, -90],
  4: [0, 90],
  5: [90, 0],
  6: [0, 180],
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class BoardDie {
  constructor(container) {
    this.root = document.createElement('div');
    this.root.className = 'board-die';
    this.root.hidden = true;

    this.shadow = document.createElement('div');
    this.shadow.className = 'die-shadow';
    this.root.appendChild(this.shadow);

    this.cube = document.createElement('div');
    this.cube.className = 'die-cube';
    for (const face of FACES) {
      const el = document.createElement('div');
      el.className = `die-face face-${face.value}`;
      el.style.transform = face.transform;
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('span');
        if (PIPS[face.value].includes(i)) cell.className = 'pip';
        el.appendChild(cell);
      }
      this.cube.appendChild(el);
    }
    this.root.appendChild(this.cube);
    container.appendChild(this.root);

    this.rotation = { x: -22, y: 26 };
    this.applyRotation(0);
  }

  applyRotation(transition) {
    this.cube.style.transition = transition ? `transform ${transition}ms cubic-bezier(0.18,0.72,0.22,1)` : 'none';
    this.cube.style.transform = `rotateX(${this.rotation.x}deg) rotateY(${this.rotation.y}deg)`;
  }

  /** Siirtää nopan lepopaikalleen ilman animaatiota (esim. ikkunan koon muuttuessa). */
  place({ x, y }) {
    this.root.style.left = `${x}px`;
    this.root.style.top = `${y}px`;
    this.root.style.transition = 'none';
    this.root.style.transform = 'translate(0, 0) scale(1)';
  }

  hide() {
    this.root.hidden = true;
  }

  /**
   * Heittää nopan: kaari ilmassa, pyörintä ja kaksi pomppua.
   * @param {number} value silmäluku, joka jää päälle
   * @param {{x:number,y:number}} from mistä noppa lähtee (paneelin pikselit)
   * @param {{x:number,y:number}} to mihin se jää lepäämään
   * @param {{onTick?:Function, onLand?:Function, onBounce?:Function, reduced?:boolean}} hooks
   */
  async roll(value, from, to, hooks = {}) {
    const { onTick, onLand, onBounce, reduced } = hooks;
    this.root.hidden = false;
    this.root.style.left = `${to.x}px`;
    this.root.style.top = `${to.y}px`;

    const [faceX, faceY] = FACE_ROTATION[value] ?? [0, 0];
    // Riittävästi kierroksia, jotta heitto näyttää oikealta noppa­heitolta.
    const spins = 3 + Math.floor(Math.random() * 3);
    const tiltX = -18 + Math.round(Math.random() * 10);
    const tiltY = 20 + Math.round(Math.random() * 14);

    if (reduced) {
      this.rotation = { x: faceX + tiltX * 0, y: faceY };
      this.place(to);
      this.applyRotation(0);
      onLand?.();
      return;
    }

    // Lähtöasento: nopan nykyinen asento, siirrettynä heittäjän kohdalle.
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    this.root.style.transition = 'none';
    this.root.style.transform = `translate(${dx}px, ${dy}px) scale(0.62)`;
    this.shadow.style.transition = 'none';
    this.shadow.style.opacity = '0.15';
    this.shadow.style.transform = 'translate(-50%, 0) scale(0.5)';
    this.applyRotation(0);
    void this.root.offsetWidth; // pakota selain huomaamaan lähtöasento

    // Pyörintä kestää koko lennon ja pysähtyy juuri laskeutumisen jälkeen.
    this.rotation = {
      x: faceX + tiltX + 360 * spins,
      y: faceY + tiltY + 360 * (spins + 1),
    };
    this.applyRotation(1000);

    // 1) nousu kaaren huipulle
    this.root.style.transition = 'transform 380ms cubic-bezier(0.2,0.9,0.35,1)';
    this.root.style.transform = `translate(${dx * 0.4}px, ${dy * 0.4 - 92}px) scale(1.22)`;
    this.shadow.style.transition = 'opacity 380ms ease-out, transform 380ms ease-out';
    this.shadow.style.opacity = '0.1';
    this.shadow.style.transform = 'translate(-50%, 0) scale(1.5)';
    onTick?.();
    await wait(190);
    onTick?.();
    await wait(190);

    // 2) putoaminen laudalle
    this.root.style.transition = 'transform 300ms cubic-bezier(0.55,0.05,0.7,1)';
    this.root.style.transform = 'translate(0, 0) scale(1)';
    this.shadow.style.transition = 'opacity 300ms ease-in, transform 300ms ease-in';
    this.shadow.style.opacity = '0.34';
    this.shadow.style.transform = 'translate(-50%, 0) scale(1)';
    await wait(290);
    onLand?.();

    // 3) pomppu ja asettuminen
    this.root.style.transition = 'transform 170ms cubic-bezier(0.25,0.9,0.4,1)';
    this.root.style.transform = 'translate(-3px, -22px) scale(1.04)';
    this.shadow.style.transition = 'opacity 170ms ease-out, transform 170ms ease-out';
    this.shadow.style.opacity = '0.18';
    this.shadow.style.transform = 'translate(-50%, 0) scale(1.18)';
    await wait(165);
    onBounce?.();

    this.root.style.transition = 'transform 220ms cubic-bezier(0.5,0.08,0.6,1)';
    this.root.style.transform = 'translate(0, 0) scale(1)';
    this.shadow.style.transition = 'opacity 220ms ease-in, transform 220ms ease-in';
    this.shadow.style.opacity = '0.34';
    this.shadow.style.transform = 'translate(-50%, 0) scale(1)';
    await wait(240);

    // Nollataan kierrokset, jotta seuraava heitto lähtee samasta asennosta.
    this.rotation = { x: faceX + tiltX, y: faceY + tiltY };
    this.applyRotation(0);
  }
}
