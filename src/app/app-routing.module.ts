import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './layouts/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ProductComponent } from './components/product/product.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { FilterComponent } from './components/filter/filter.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'san-pham/:id',
    component: ProductComponent,
  },
  {
    path: 'gio-hang',
    component: CartComponent,
  },
  {
    path: 'thanh-toan',
    component: CheckoutComponent,
  },
  {
    path: 'thankyou',
    component: ThankyouComponent,
  },
  {
    path: 'danh-muc-san-pham',
    component: FilterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
