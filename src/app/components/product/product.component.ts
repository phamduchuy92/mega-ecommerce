import {
  AfterViewChecked,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, AfterViewChecked {
  _ = _;
  product: any = {};
  images: any[] = [];
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let id = params.id;
      this.productService
        .find(id)
        .pipe(map((res) => res.body || []))
        .subscribe((prod) => {
          this.product = prod;
          if (prod.images) {
            this.images = prod.images;
          }
        });
    });
  }

  ngAfterViewChecked(): void {
    // Products Slick
    $('.carousel-indicators')
      .children()
      .each((i, e) => {
        if ($(e).children().length == 0) {
          $(e).append(
            `<img class="d-block w-100 img-fluid" src="${this.getFileSrc(
              this.images[i]
            )}" style="height: 80px; object-fit: cover" />`
          );
        }
      });
    $('.carousel-indicators').each(function () {
      $(this).insertAfter($(this).parent().find('.carousel-inner'));
    });
  }

  addToCart(id: number) {
    this.cartService.addToCart(id, this.quantity);
  }

  getFileSrc(val: string): string {
    const bucketName = 'admin-1';
    return `services/storage-mgmt/api/statics/${bucketName}/${val}`;
  }
}
