import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  lastScrollTop = 0;
  isHidden = false;
  isScrolled = false;

  @HostListener('window:scroll', [])
  onScroll() {
    const currentScroll = window.scrollY;

    this.isHidden = currentScroll > this.lastScrollTop;
    this.isScrolled = currentScroll > 70;

    this.lastScrollTop = currentScroll;
  }
}
