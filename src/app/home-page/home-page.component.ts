import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  currentIndex = 0;
  autoSlideInterval: any;
  readonly SLIDE_DURATION = 4000;

  carouselImages: string[] = [
    'carousel-2.jpg',
    'carousel-1.jpg',
    'carousel-3.jpg',
    'carousel-4.jpg',
    'carousel-5.jpg'
  ];

  constructor(private router: Router) {}
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  // ngOnInit(): void {
  //   this.startAutoSlide();
  // }

  // ngOnDestroy(): void {
  //   this.stopAutoSlide();
  // }

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextImage();
    }, this.SLIDE_DURATION);
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.carouselImages.length;
  }

  prevImage(): void {
    this.currentIndex = this.currentIndex === 0
      ? this.carouselImages.length - 1
      : this.currentIndex - 1;
  }

  onManualNavigation(direction: 'next' | 'prev'): void {
    this.stopAutoSlide();

    if (direction === 'next') {
      this.nextImage();
    } else {
      this.prevImage();
    }

    setTimeout(() => this.startAutoSlide(), 1000);
  }

  goToSlide(index: number): void {
    this.stopAutoSlide();
    this.currentIndex = index;
    setTimeout(() => this.startAutoSlide(), 1000);
  }

  goToProducts(): void {
    this.router.navigate(['/thecrumbco/products']);
  }
}