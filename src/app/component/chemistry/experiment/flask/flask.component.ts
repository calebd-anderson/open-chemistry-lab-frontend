import { Component, effect, inject, OnInit } from '@angular/core';
import gsap from 'gsap';
import { ExperimentService } from 'src/app/service/experiment.service';

@Component({
  selector: 'app-flask',
  imports: [],
  templateUrl: './flask.component.html',
  styleUrl: './flask.component.scss'
})
export class FlaskComponent implements OnInit {

  public experimentService: ExperimentService = inject(ExperimentService)
  private tl = gsap.timeline({repeat: -1, repeatRefresh: true})

  constructor() {
    effect(() => {
      if (this.experimentService.getIsActive())
        this.animateBubbles()
      else {
        this.tl.restart()
        this.tl.pause()
      }
    });
  }

  private animateBubbles(): void {
    const svg = document.getElementById('svg-flask');
    const bubble0 = document.getElementById('bubble0');
    const numBubbles = 25;

    // create numBubbles + 1 bubbles
    for(let i = 0; i < numBubbles; i++) {
      let clone = bubble0.cloneNode() as HTMLElement;
      clone.id = `bubble${i+1}`
      svg.appendChild(clone);
    }

    this.tl.fromTo('.bubble', { opacity: 0, attr: {r: 5} }, {
      y: -210,
      duration: "random(3,8)",
      ease: "sine.inOut",
      stagger: {each: .1, repeat: -1},
      opacity: .8,
      attr: {r: 20},
      repeat: -1,
      x: "random(-60, 60, 10)"
    }, "random(-.2, .6, .2)")
  }

  ngOnInit(): void {
    const bubble0 = document.getElementById('bubble0');
    bubble0.style.opacity = '0';
  }
}
