import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { map, tap } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { ProductCategoryService } from 'src/app/services/productCategory.service';
import { LabelType } from '@angular-slider/ngx-slider';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  _ = _;
  products: any[] = [];
  categories: any[] = [];
  name = '';
  categoryId = 0;
  title = '';
  sort = 'price,asc';
  priceFrom = 0;
  priceTo = 0;
  options = {
    floor: 0,
    step: 50000,
    ceil: 1000000,
    showTicks: true,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Từ:</b> ' + value.toLocaleString('en') + 'đ';
        case LabelType.High:
          return '<b>Đến:</b> ' + value.toLocaleString('en') + 'đ';
        default:
          return '' + value.toLocaleString('en');
      }
    },
  };
  totalItems = 0;
  itemsPerPage = 9;
  page = 1;

  constructor(
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private productCategoryService: ProductCategoryService
  ) {
    const state = this.router.getCurrentNavigation()!.extras.state;
    forkJoin(this.productService.query(), this.productCategoryService.query())
      .pipe(map((res) => _.map(res, 'body') || []))
      .subscribe((res) => {
        this.products = res[0];
        this.categories = res[1];

        if (state && state.productCategoryId) {
          this.selectCategory(state.productCategoryId);
        }
      });
  }

  ngOnInit(): void {}

  addProduct(id: number): void {
    this.cartService.addToCart(id);
  }

  selectCategory(id: number): void {
    this.categoryId = id;
    this.page = 1;
    this.title = _.get(_.find(this.categories, ['id', id]), 'name');
    this.transition();
  }

  filterPrice(): void {
    this.page = 1;
  }

  transition(): void {
    let params = {
      size: this.itemsPerPage,
      page: this.page - 1,
      sort: [this.sort],
    };
    if (this.categoryId != 0) {
      params = _.assign(params, { productCategoryId: this.categoryId });
    }
    if (this.priceTo != 0) {
      params = _.assign(params, {
        priceFrom: this.priceFrom,
        priceTo: this.priceTo,
      });
    }
    if (this.name != '') {
      params = _.assign(params, {
        name: this.name,
      });
    }
    this.productService
      .query(params)
      .pipe(
        tap(
          (res) =>
            (this.totalItems = _.toNumber(res.headers.get('X-Total-Count')))
        ),
        map((res) => res.body || [])
      )
      .subscribe((res) => (this.products = res));
  }

  clear(): void {
    this.page = 1;
    this.router.navigateByUrl("/").then(() =>
      this.router.navigateByUrl("/danh-muc-san-pham")
    );
  }
  getFileSrc(val: string): string {
    const bucketName = 'admin-1';
    return `services/storage-mgmt/api/statics/${bucketName}/${val}`;
  }
}
