import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  _ = _;
  products: any[] = [];
  constructor(private productService: ProductService, private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.productService
      .query()
      .pipe(map((res) => res.body || []))
      .subscribe((res) => (this.products = res));
  }

  addProduct(id: number): void {
    this.cartService.addToCart(id);
  }

  selectProduct(id: number): void {
    this.router.navigateByUrl(`/product/${id}`);
  }
}
