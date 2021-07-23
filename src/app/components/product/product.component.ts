import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
declare let $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, AfterViewInit {
  _ = _;
  product: any = {};
  @ViewChild('quantityInput') quantityInput: any;
  images: any[] = [];
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
  ngAfterViewInit(): void {
    // Products Slick
    $('.products-slick').map(function (e: any) {
      var $this = $(e),
        $nav = $this.attr('data-nav');

      e.slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        infinite: true,
        speed: 300,
        dots: false,
        arrows: true,
        appendArrows: $nav ? $nav : false,
        responsive: [
          {
            breakpoint: 991,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      });
    });

    // Products Widget Slick
    $('.products-widget-slick').each(function (e: any) {
      var $this = $(e),
        $nav = $this.attr('data-nav');

      $this.slick({
        infinite: true,
        autoplay: true,
        speed: 300,
        dots: false,
        arrows: true,
        appendArrows: $nav ? $nav : false,
      });
    });

    /////////////////////////////////////////

    // Product Main img Slick
    $('#product-main-img').slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    $('#product-imgs').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: '#product-main-img',
      responsive: [
        {
          breakpoint: 991,
          settings: {
            vertical: false,
            arrows: false,
            dots: true,
          },
        },
      ],
    });

    // Product img zoom
    var zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
      $('#product-main-img .product-preview').zoom();
    }
  }

  addToCart(id: number) {
    this.cartService.addToCart(id, this.quantityInput.nativeElement.value);
  }

  increase() {
    let value = Number(this.quantityInput.nativeElement.value);
    if (this.product.quantity > 0) {
      value++;

      if (value > this.product.quantity) {
        value = this.product.quantity;
      }
    } else {
      return;
    }

    this.quantityInput.nativeElement.value = value.toString();
  }

  decrease() {
    let value = Number(this.quantityInput.nativeElement.value);
    if (this.product.quantity > 0) {
      value--;

      if (value < 1) {
        value = 0;
      }
    } else {
      return;
    }
    this.quantityInput.nativeElement.value = value.toString();
  }
}
