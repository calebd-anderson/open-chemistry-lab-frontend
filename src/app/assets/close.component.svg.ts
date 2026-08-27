import { Component, input } from '@angular/core';

@Component({
  selector: 'svg[close-icon]',
  template: `
    <svg
      viewBox="-0.5 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 21.32L21 3.32001"
        stroke="#000000"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3 3.32001L21 21.32"
        stroke="#000000"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
  host: {
    '[attr.viewBox]': 'viewBox()',
  },
})
export class CloseIcon {
  readonly viewBox = input<string>('0 0 24 24');
}
