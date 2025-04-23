import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-predictor',
  imports: [FormsModule],
  templateUrl: './predictor.component.html',
  styleUrl: './predictor.component.scss'
})
export class PredictorComponent {
  year = 2020;
  mileage = 50000;
  engine_size = 2.0;
  predictedPrice: number | null = null;
  isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  predict() {
    if (!this.isBrowser) return; // avoid SSR API call

    this.http.post<any>('http://localhost:5000/predict', {
      year: this.year,
      mileage: this.mileage,
      engine_size: this.engine_size
    }).subscribe(res => {
      this.predictedPrice = res.price;
    });
  }
}
