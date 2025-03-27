import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="wrapper">
      <app-header></app-header>

      <main class="container">
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    html, body {
      height: 100%;
      margin: 0;
      display: flex;
      flex-direction: column;
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .container {
      flex-grow: 1;
      padding: 20px;
    }
    
    app-header {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      transition: opacity 0.3s ease-in-out;
    }

    app-footer {
      margin-top: auto;
    }
  `],
})
export class AppComponent {
  title = 'gestAceite-Front-End';
}