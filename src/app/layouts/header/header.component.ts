import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import * as _ from 'lodash';
import { Cart } from 'src/app/models/cart.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  _ = _;
  cartData!: Cart;
  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartData$.subscribe((data: Cart) => {
      this.cartData = data;
    });
  }
}
