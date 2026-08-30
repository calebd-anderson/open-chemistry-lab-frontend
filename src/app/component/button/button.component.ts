import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'ghost' | 'danger'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  title = input('unnamed button');
  disabled = input(false);
  fullWidth = input(false);

  clicked = output<Event>();

  handleClick(event: Event) {
    if (!this.disabled()) {
      this.clicked.emit(event);
    }
  }

  get classes(): string {
    return [
      'app-button',
      `app-button--${this.variant()}`,
      `app-button--${this.size()}`,
      this.fullWidth() ? 'app-button--full' : '',
      this.disabled() ? 'app-button--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
