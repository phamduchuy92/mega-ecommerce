import { Component, OnInit } from '@angular/core';
import { Cart } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  _ = _;
  cartData!: Cart;
  constructor(public cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe((data: Cart) => {
      this.cartData = data;
    });
  }

  changeQuantity(id: number, increaseQuantity: boolean) {
    this.cartService.updateData(id, increaseQuantity);
  }
}
