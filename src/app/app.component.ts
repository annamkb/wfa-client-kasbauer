import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './header/header.component';

@Component({
  selector: 'bs-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
})

export class AppComponent {
  title = 'tutoring25';

}
