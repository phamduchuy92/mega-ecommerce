import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Cart } from 'src/app/models/cart.model';
import { ProductService } from 'src/app/services/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { OrderService } from './order.service';
import { OrderDetailService } from './order-detail.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Cart = { data: [{ product: {}, quantity: 0 }], total: 0 };

  cartData$ = new BehaviorSubject<Cart>(this.cart);
  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private orderDetailService: OrderDetailService,
    private httpClient: HttpClient,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toast: ToastrService
  ) {
    this.cartData$.next({ ...this.cart });
    let cart = localStorage.getItem('cart');
    if (cart) {
      let info: Cart = JSON.parse(cart);
      this.cart = info;
      this.cartData$.next({ ...this.cart });
    }
  }

  addToCart(id: number, quantity?: number) {
    this.productService
      .find(id)
      .pipe(map((res) => res.body || []))
      .subscribe((prod) => {
        // if the cart is empty
        if (this.cart.data[0].quantity === 0) {
          this.cart.data[0].product = prod;
          this.cart.data[0].quantity = quantity ? quantity : 1;
          this.toast.success(
            `${prod.title} đã được thêm vào giỏ.`,
            'Thông Báo',
            {
              timeOut: 1500,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right',
            }
          );
        }
        // if cart is not empty
        else {
          let index = _.findIndex(this.cart.data, (e) => {
            return e.product.id === prod.id;
          });
          // if chosen product is already in cart array
          if (index !== -1) {
            if (quantity) {
              if (this.cart.data[index].quantity + quantity < prod.quantity)
                this.cart.data[index].quantity =
                  this.cart.data[index].quantity + quantity;
              else {
                this.cart.data[index].quantity = prod.quantity;
              }
            } else {
              if (this.cart.data[index].quantity < prod.quantity) {
                this.cart.data[index].quantity++;
              } else {
                this.cart.data[index].quantity = prod.quantity;
              }
            }
            this.toast.info(
              `Số lượng ${prod.title} trong giỏ hàng đã được cập nhât.`,
              'Thông Báo',
              {
                timeOut: 1500,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right',
              }
            );
          }
          // if chosen product is not in cart array
          else {
            if (quantity) {
              this.cart.data.push({
                product: prod,
                quantity: quantity,
              });
            } else {
              this.cart.data.push({
                product: prod,
                quantity: 1,
              });
            }
            this.toast.success(
              `${prod.title} đã được thêm vào giỏ.`,
              'Thông Báo',
              {
                timeOut: 1500,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right',
              }
            );
          }
        }
      });
    this.calculateTotal(this.cart);
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.cartData$.next({ ...this.cart });
  }

  updateData(index: number, increase: boolean) {
    let data = this.cart.data[index];
    if (increase) {
      data.quantity < data.product.quantity
        ? data.quantity++
        : data.product.quantity;
    } else {
      data.quantity < 2 ? 1 : data.quantity--;
    }
    this.calculateTotal(this.cart);
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.cartData$.next({ ...this.cart });
  }

  deleteFromCart(index: number): void {
    if (window.confirm('Bạn có muốn xóa sản phẩm này?')) {
      if (this.cart.data.length > 1) {
        this.cart.data.splice(index, 1);
        this.calculateTotal(this.cart);
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.cartData$.next({ ...this.cart });
      } else {
        this.resetLocalStorage();
      }
    }
    // if the user doesn't want to delete the product, hits the CANCEL button
    else {
      return;
    }
  }

  calculateSubTotal(index: number): number {
    let subTotal = 0;

    let d = this.cart.data[index];
    subTotal = d.product.price * d.quantity;

    return subTotal;
  }

  protected calculateTotal(cart: Cart): void {
    let total = 0;

    _.forEach(cart.data, (p) => {
      total += p.quantity * p.product.price;
    });
    cart.total = total;
  }

  protected resetLocalStorage(): void {
    this.cart = {
      data: [
        {
          product: {},
          quantity: 0,
        },
      ],
      total: 0,
    };
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.cartData$.next({ ...this.cart });
  }
}
