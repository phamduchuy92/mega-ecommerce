import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import * as _ from 'lodash';
import { Cart } from 'src/app/models/cart.model';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  _ = _;
  cartData!: Cart;
  constructor(public cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cartData$.subscribe((data: Cart) => {
      this.cartData = data;
    });
  }

  viewCart(): void {
    if (!$('.side').last().hasClass('on')) {
      $('.side').last().addClass('on');
    } else {
      this.closeCart();
    }
  }

  closeCart(): void {
    $('.side').last().removeClass('on');
  }

  viewSearch(): void {
    if ($('.top-search').last().css('display') == 'none') {
      $('.top-search').last().css('display', 'block');
    } else {
      this.closeSearch();
    }
  }

  closeSearch(): void {
    $('.top-search').last().css('display', 'none');
  }

  getFileSrc(val: string): string {
    const bucketName = 'admin-1';
    return `services/storage-mgmt/api/statics/${bucketName}/${val}`;
  }
}
