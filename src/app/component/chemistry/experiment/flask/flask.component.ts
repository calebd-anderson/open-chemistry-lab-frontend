import { Component, effect, inject, linkedSignal, OnInit } from '@angular/core';
import gsap from 'gsap';
import { ExperimentService } from '@app/service/experiment.service';

@Component({
  selector: 'app-flask',
  imports: [],
  templateUrl: './flask.component.html',
  styleUrl: './flask.component.scss',
})
export class FlaskComponent implements OnInit {
  public experimentService = inject(ExperimentService);
  private tl = gsap.timeline({ repeat: -1, repeatRefresh: true });

  expirmentIsActive = linkedSignal(() => this.experimentService.getIsActive());

  constructor() {
    effect(() => {
      if (this.experimentService.getIsActive()) {
        this.animateBubbles();
        this.tl.resume();
      } else {
        this.tl.restart().pause();
      }
    });
  }

  private animateBubbles(): void {
    const svg = document.getElementById('svg-flask');
    const bubble0 = document.getElementById('bubble0');
    const numBubbles = 30;

    // Create bubbles
    for (let i = 0; i < numBubbles; i++) {
      let clone = bubble0?.cloneNode() as HTMLElement;
      if (clone) {
        clone.id = `bubble${i + 1}`;
        svg?.appendChild(clone);

        // Set initial properties for each bubble
        (clone as HTMLElement).style.opacity = '0';
        (clone as HTMLElement).setAttribute('r', Math.random() * 15 + 5 + '');
      }
    }

    // Animate bubbles with more chemistry-like behavior
    this.tl.fromTo(
      '.bubble',
      {
        opacity: 0,
        attr: { r: 5 },
        y: 0,
        x: 0
      },
      {
        y: -250,
        duration: 'random(3,6)',
        ease: 'sine.inOut',
        stagger: { each: 0.1, repeat: -1 },
        opacity: 'random(0.6, 0.9)',
        attr: { r: 'random(8,25)' },
        repeat: -1,
        x: 'random(-40, 40, 5)',
        scale: 'random(0.8, 1.2)',
      },
      'random(-.2, .6, .2)'
    );
  }

  ngOnInit(): void {
    const bubble0 = document.getElementById('bubble0');
    if (bubble0)
      bubble0.style.opacity = '0';
  }
}
