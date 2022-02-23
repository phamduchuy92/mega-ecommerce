import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { CartService } from 'src/app/services/cart.service';
import { ProductCategoryService } from 'src/app/services/productCategory.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  _ = _;
  products: any[] = [];
  categories: any[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private productCategoryService: ProductCategoryService
  ) {
    forkJoin(this.productService.query(), this.productCategoryService.query())
      .pipe(map((res) => _.map(res, 'body') || []))
      .subscribe((res) => {
        this.products = res[0];
        this.categories = res[1];
      });
  }

  ngOnInit(): void {}

  addProduct(id: number): void {
    this.cartService.addToCart(id);
  }

  viewMore(id: number): void {
    this.router.navigateByUrl('/danh-muc-san-pham', {
      state: {
        productCategoryId: id,
      },
    });
  }

  getFileSrc(val: string): string {
    const bucketName = 'admin-1';
    return `services/storage-mgmt/api/statics/${bucketName}/${val}`;
  }
}
