import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-flask',
  imports: [],
  templateUrl: './flask.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './flask.component.scss',
})
export class FlaskComponent implements AfterViewInit {
  atomCount = input(0);
  maxAtoms = input.required<number>();
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewReady = signal(false);
  private previousAtomCount = 0;

  constructor() {
    effect(() => {
      const count = this.atomCount();
      if (!this.viewReady()) {
        this.previousAtomCount = count;
        return;
      }

      const added = count - this.previousAtomCount;
      this.previousAtomCount = count;
      this.animateSolutionLevel(count, this.maxAtoms());
      if (added > 0) this.animateAddition(added);
    });
    this.destroyRef.onDestroy(() => {
      gsap.killTweensOf(this.host.nativeElement.querySelectorAll('*'));
    });
  }

  ngAfterViewInit(): void {
    this.previousAtomCount = this.atomCount();
    this.viewReady.set(true);
  }

  private animateAddition(added: number): void {
    const svg = this.host.nativeElement.querySelector<SVGSVGElement>('#svg-flask');
    if (!svg) return;

    this.animateEscapingBubbles(added);
    gsap.fromTo(
      svg,
      { rotation: 0 },
      {
        rotation: added % 2 ? 1.1 : -1.1,
        duration: 0.12,
        repeat: 3,
        yoyo: true,
        ease: 'sine.inOut',
        transformOrigin: '50% 88%',
        overwrite: 'auto',
      },
    );
  }

  private animateEscapingBubbles(added: number): void {
    const bubbleGroup = this.host.nativeElement.querySelector<SVGGElement>('.escaping-bubbles');
    if (!bubbleGroup) return;

    const bubbleCount = Math.min(4 + added * 2, 12);
    for (let index = 0; index < bubbleCount; index++) {
      const bubble = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const startX = gsap.utils.random(78, 126);
      const startY = gsap.utils.random(258, 270);
      const startRadius = gsap.utils.random(4.5, 7);
      const controlOneX = gsap.utils.random(91, 111);
      const controlTwoX = gsap.utils.random(94, 110);
      const endX = gsap.utils.random(96, 108);
      const sway = gsap.utils.random(1.5, 4);
      const phase = gsap.utils.random(0, Math.PI * 2);
      const path = { progress: 0 };
      bubbleGroup.appendChild(bubble);
      bubble.setAttribute('fill', 'rgba(178, 255, 239, 0.42)');
      bubble.setAttribute('stroke', 'rgba(232, 255, 249, 0.98)');
      bubble.setAttribute('stroke-width', '1.2');
      bubble.setAttribute('filter', 'drop-shadow(0 0 3px rgba(132, 255, 235, 0.95))');

      gsap.set(bubble, {
        attr: { cx: startX, cy: startY, r: startRadius },
        opacity: 0,
      });
      gsap.to(path, {
        progress: 1,
        delay: index * 0.065,
        duration: gsap.utils.random(1.45, 1.9),
        ease: 'power1.inOut',
        onUpdate: () => {
          const t = path.progress;
          const inverse = 1 - t;
          const x =
            inverse ** 3 * startX +
            3 * inverse ** 2 * t * controlOneX +
            3 * inverse * t ** 2 * controlTwoX +
            t ** 3 * endX +
            Math.sin(t * Math.PI * 2 + phase) * sway;
          const y =
            inverse ** 3 * startY +
            3 * inverse ** 2 * t * 238 +
            3 * inverse * t ** 2 * 180 +
            t ** 3 * 147;
          const fadeIn = Math.min(1, t / 0.08);
          const fadeOut = Math.min(1, (1 - t) / 0.16);

          gsap.set(bubble, {
            attr: {
              cx: x,
              cy: y,
              r: startRadius * (1 + t * 0.22),
            },
            opacity: Math.min(fadeIn, fadeOut),
          });
        },
        onComplete: () => bubble.remove(),
      });
    }
  }

  private animateSolutionLevel(atomCount: number, maxAtoms: number): void {
    const liquid = this.host.nativeElement.querySelector<SVGPathElement>('.solution-liquid');
    const surface = this.host.nativeElement.querySelector<SVGPathElement>('.solution-surface');
    if (!liquid || !surface) return;

    const fillFraction = maxAtoms > 0
      ? Math.min(Math.max(atomCount / maxAtoms, 0), 1)
      : 0;
    const emptyLevel = 310;
    const fullLevel = 226;
    const level = emptyLevel - fillFraction * (emptyLevel - fullLevel);
    gsap.to(liquid, {
      attr: { d: this.liquidPath(level) },
      duration: 0.8,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    gsap.to(surface, {
      attr: { d: this.surfacePath(level) },
      duration: 0.8,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  private liquidPath(level: number): string {
    return `M25 ${level}c22-5 40 3 61 0 20-3 38-4 59 0 15 3 27 1 40-2v120H25z`;
  }

  private surfacePath(level: number): string {
    return `M27 ${level}c22-5 40 3 59 0 20-3 38-4 59 0 15 3 27 1 40-2`;
  }
}
