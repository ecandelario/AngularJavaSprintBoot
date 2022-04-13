import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Output()
  newMenuToggle: EventEmitter<string> = new EventEmitter<string>();
  toggled: string = 'toggled';

  constructor() {}

  onToggle() {
    this.newMenuToggle.emit(this.toggled);
  }
}
