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

interface BubbleMotion {
  element: SVGGElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  age: number;
  lifetime: number;
  exitY: number;
  wobbleAmplitude: number;
  wobbleFrequency: number;
  wobblePhase: number;
  wobbleOffset: number;
}

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
  isActive = input(false);
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewReady = signal(false);
  private previousAtomCount = 0;
  private processingTimeline?: gsap.core.Timeline;
  private readonly addedBubbleMotions: BubbleMotion[] = [];
  private bubbleTickerActive = false;
  private readonly bubbleTicker = (_time: number, deltaTime: number) =>
    this.updateAddedBubbles(Math.min(deltaTime / 1000, 0.05));

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
    effect(() => {
      if (!this.viewReady()) return;
      this.animateProcessing(this.isActive());
    });
    this.destroyRef.onDestroy(() => {
      this.processingTimeline?.kill();
      this.stopBubbleTicker();
      gsap.killTweensOf(this.host.nativeElement.querySelectorAll('*'));
    });
  }

  ngAfterViewInit(): void {
    this.previousAtomCount = this.atomCount();
    this.viewReady.set(true);
  }

  private animateProcessing(isActive: boolean): void {
    this.processingTimeline?.kill();
    this.processingTimeline = undefined;

    const svg = this.host.nativeElement.querySelector<SVGSVGElement>('#svg-flask');
    const glow = this.host.nativeElement.querySelector<SVGPathElement>('.solution-glow');
    const surface = this.host.nativeElement.querySelector<SVGPathElement>('.solution-surface');
    if (!svg || !glow || !surface) return;

    gsap.set(svg, { clearProps: 'rotation,scale' });
    gsap.set(glow, { opacity: 0 });
    gsap.set(surface, { attr: { 'stroke-opacity': 0.82 } });
    if (!isActive) {
      this.clearAddedBubbles();
      return;
    }

    const timeline = gsap.timeline({ repeat: -1 });
    this.processingTimeline = timeline;
    timeline.to(svg, {
      rotation: 1.1,
      scale: 1.025,
      duration: 0.7,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      transformOrigin: '50% 88%',
    }, 0);
    timeline.to(glow, {
      opacity: 0.48,
      duration: 1.35,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    }, 0);
    timeline.to(surface, {
      attr: { 'stroke-opacity': 1 },
      duration: 0.55,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    }, 0);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(glow, { opacity: 0.3 });
      timeline.kill();
      this.processingTimeline = undefined;
      gsap.set(svg, { clearProps: 'rotation,scale' });
      gsap.set(surface, { attr: { 'stroke-opacity': 1 } });
      this.animateEscapingBubbles(1);
      return;
    }

    const bubbleBursts = gsap.timeline({ repeat: -1, repeatDelay: 2.8 });
    bubbleBursts.call(() => this.animateEscapingBubbles(1));
    timeline.add(bubbleBursts, 0);
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
    const bubbleGroup = this.host.nativeElement.querySelector<SVGGElement>('.added-bubbles');
    if (!bubbleGroup) return;

    const bubbleCount = Math.min(3 + added, 7);
    for (let index = 0; index < bubbleCount; index++) {
      const bubble = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const startY = gsap.utils.random(270, 282);
      const startRadius = gsap.utils.random(5.2, 7.8);
      const [left, right] = this.bubbleBounds(startY, startRadius);
      const startX = gsap.utils.random(left, right);
      const riseSpeed = gsap.utils.random(84, 92);
      const exitY = gsap.utils.random(65, 108);
      const initialAge = -index * gsap.utils.random(0.2, 0.34);
      const wobbleAmplitude = gsap.utils.random(3, 7);
      const wobbleFrequency = gsap.utils.random(5, 8);
      const wobblePhase = gsap.utils.random(0, Math.PI * 2);
      const shell = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      shell.setAttribute('class', 'bubble-shell');
      shell.setAttribute('r', String(startRadius));
      shell.setAttribute('fill', 'rgba(178, 255, 239, 0.34)');
      shell.setAttribute('stroke', 'rgba(232, 255, 249, 0.98)');
      shell.setAttribute('stroke-width', '1.2');
      shell.setAttribute('filter', 'drop-shadow(0 0 2px rgba(132, 255, 235, 0.75))');
      const highlight = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      highlight.setAttribute('class', 'bubble-highlight');
      highlight.setAttribute('cx', String(-startRadius * 0.32));
      highlight.setAttribute('cy', String(-startRadius * 0.36));
      highlight.setAttribute('r', String(startRadius * 0.2));
      highlight.setAttribute('fill', 'rgba(255, 255, 255, 0.95)');
      const glint = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      glint.setAttribute('class', 'bubble-glint');
      glint.setAttribute('cx', String(startRadius * 0.35));
      glint.setAttribute('cy', String(startRadius * 0.28));
      glint.setAttribute('rx', String(startRadius * 0.34));
      glint.setAttribute('ry', String(startRadius * 0.14));
      glint.setAttribute('fill', 'rgba(230, 255, 250, 0.62)');
      bubble.append(shell, highlight, glint);
      bubble.setAttribute('class', 'added-bubble');
      bubble.setAttribute('opacity', '0');
      bubble.setAttribute('transform', `translate(${startX} ${startY})`);
      bubbleGroup.appendChild(bubble);

      this.addedBubbleMotions.push({
        element: bubble,
        x: startX,
        y: startY,
        vx: gsap.utils.random(-38, 38),
        vy: -riseSpeed,
        radius: startRadius,
        age: initialAge,
        lifetime: (startY - exitY) / riseSpeed + gsap.utils.random(0.2, 0.65),
        exitY,
        wobbleAmplitude,
        wobbleFrequency,
        wobblePhase,
        wobbleOffset: Math.sin(initialAge * wobbleFrequency + wobblePhase) * wobbleAmplitude,
      });
    }
    this.startBubbleTicker();
  }

  private startBubbleTicker(): void {
    if (this.bubbleTickerActive) return;
    gsap.ticker.add(this.bubbleTicker);
    this.bubbleTickerActive = true;
  }

  private stopBubbleTicker(): void {
    if (!this.bubbleTickerActive) return;
    gsap.ticker.remove(this.bubbleTicker);
    this.bubbleTickerActive = false;
  }

  private updateAddedBubbles(deltaTime: number): void {
    const step = Math.min(deltaTime, 1 / 60);
    for (const bubble of this.addedBubbleMotions) {
      bubble.age += deltaTime;
      if (bubble.age < 0) continue;
      bubble.y += bubble.vy * step;
      const nextWobble =
        Math.sin(bubble.age * bubble.wobbleFrequency + bubble.wobblePhase) *
        bubble.wobbleAmplitude;
      bubble.x += nextWobble - bubble.wobbleOffset;
      bubble.wobbleOffset = nextWobble;

      if (bubble.y >= 173) {
        const [left, right] = this.bubbleBounds(bubble.y, bubble.radius);
        bubble.x += bubble.vx * step;
        if (bubble.x < left) {
          bubble.x = left + (left - bubble.x);
          bubble.vx = Math.abs(bubble.vx);
        } else if (bubble.x > right) {
          bubble.x = right - (bubble.x - right);
          bubble.vx = -Math.abs(bubble.vx);
        }
      } else if (bubble.y >= 170) {
        const [left, right] = this.bubbleBounds(bubble.y, bubble.radius);
        bubble.x += (102 - bubble.x) * Math.min(deltaTime * 3, 1);
        bubble.x = Math.max(left, Math.min(right, bubble.x));
      } else {
        bubble.x += (102 - bubble.x) * Math.min(deltaTime * 0.6, 1);
      }
    }

    for (let first = 0; first < this.addedBubbleMotions.length; first++) {
      const a = this.addedBubbleMotions[first];
      if (a.age < 0) continue;
      for (let second = first + 1; second < this.addedBubbleMotions.length; second++) {
        const b = this.addedBubbleMotions[second];
        if (b.age < 0) continue;

        let dx = b.x - a.x;
        let dy = b.y - a.y;
        const distance = Math.hypot(dx, dy);
        const minDistance = a.radius + b.radius;
        if (distance >= minDistance) continue;
        if (distance === 0) dx = 0.01;

        const safeDistance = Math.hypot(dx, dy);
        const nx = dx / safeDistance;
        const overlap = minDistance - safeDistance;
        const nudge = overlap * 0.35;
        a.x -= nx * nudge;
        b.x += nx * nudge;
        a.vx -= nx * 5;
        b.vx += nx * 5;
      }
    }

    for (const bubble of this.addedBubbleMotions) {
      if (bubble.age < 0 || bubble.y < 170) continue;
      const [left, right] = this.bubbleBounds(bubble.y, bubble.radius);
      if (bubble.x < left) {
        bubble.x = left;
        bubble.vx = Math.abs(bubble.vx);
      } else if (bubble.x > right) {
        bubble.x = right;
        bubble.vx = -Math.abs(bubble.vx);
      }
    }

    for (let index = this.addedBubbleMotions.length - 1; index >= 0; index--) {
      const bubble = this.addedBubbleMotions[index];
      if (bubble.y <= bubble.exitY || bubble.age >= bubble.lifetime) {
        bubble.element.remove();
        this.addedBubbleMotions.splice(index, 1);
        continue;
      }

      const fadeIn = Math.min(1, bubble.age / 0.12);
      const fadeOut = Math.min(1, Math.max(0, (bubble.y - bubble.exitY) / 28));
      const wobbleY =
        Math.sin(bubble.age * bubble.wobbleFrequency * 1.35 + bubble.wobblePhase) * 1.1;
      bubble.element.setAttribute(
        'transform',
        `translate(${bubble.x} ${bubble.y + wobbleY}) scale(${0.9 + Math.min(bubble.age, 0.4) * 0.25})`,
      );
      bubble.element.setAttribute('opacity', String(Math.min(fadeIn, fadeOut)));
    }

    if (this.addedBubbleMotions.length === 0) this.stopBubbleTicker();
  }

  private bubbleBounds(y: number, radius: number): [number, number] {
    if (y >= 289) {
      const progress = Math.min((y - 289) / 15, 1);
      return [33 + progress * 20 + radius, 172 - progress * 21 - radius];
    }
    if (y >= 252) {
      const progress = (y - 252) / 37;
      return [86 - progress * 53 + radius, 119 + progress * 53 - radius];
    }
    if (y >= 240) {
      const progress = (y - 240) / 12;
      return [92 - progress * 6 + radius, 112 + progress * 7 - radius];
    }
    return [92 + radius, 112 - radius];
  }

  private clearAddedBubbles(): void {
    const bubbleGroup = this.host.nativeElement.querySelector<SVGGElement>('.added-bubbles');
    if (!bubbleGroup) return;

    bubbleGroup.replaceChildren();
    this.addedBubbleMotions.length = 0;
    this.stopBubbleTicker();
  }

  private animateSolutionLevel(atomCount: number, maxAtoms: number): void {
    const liquid = this.host.nativeElement.querySelector<SVGPathElement>('.solution-liquid');
    const glow = this.host.nativeElement.querySelector<SVGPathElement>('.solution-glow');
    const surface = this.host.nativeElement.querySelector<SVGPathElement>('.solution-surface');
    if (!liquid || !glow || !surface) return;

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
    gsap.to(glow, {
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
