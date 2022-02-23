import { Component, OnInit } from '@angular/core';
import { Cart } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  _ = _;
  cartData!: Cart;
  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartData$.subscribe((data: Cart) => {
      this.cartData = data;
    });
  }

  changeQuantity(idx: number, increaseQuantity: boolean) {
    this.cartService.updateData(idx, increaseQuantity);
  }

  updateQuantity(idx: number, event: any): void {
    this.cartService.updateData(
      idx,
      this.cartData.data[idx].quantity < event.target.value ? true : false
    );
  }

  getFileSrc(val: string): string {
    const bucketName = 'admin-1';
    return `services/storage-mgmt/api/statics/${bucketName}/${val}`;
  }
}
