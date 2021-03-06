import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ProductService } from '../services/product.service';
import { take } from 'rxjs/operators';





@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.page.html',
  styleUrls: ['./cart-modal.page.scss'],
})

export class CartModalPage implements OnInit {
  products = [];
  prodVal = [];
 
  constructor(
    private productService: ProductService, 
    private modalCtrl: ModalController, 
    private alertCtrl: AlertController,
    ) { }
 
  ngOnInit() {
    const cartItems = this.productService.cart.value;
    console.log(cartItems);
    
 
    this.productService.getProducts().pipe(take(1)).subscribe(allProducts => {
      this.products = allProducts.filter(p => cartItems[p.id]).map(product => {

        this.prodVal.push(product);
        
        // this.prodVal = product;
        return { ...product, count: cartItems[product.id] };
      });
    });
  } 
 
  async checkout() {
    this.productService.checkoutCart(this.getTotal(), this.products);
    const alert = await this.alertCtrl.create({
      header: 'Order Preparing....',
      message: 'The Seller is preparing your order',
      buttons: ['Continue shopping']
    });
 
    await alert.present();
    
    this.modalCtrl.dismiss();
  }
 
  close() {
    this.modalCtrl.dismiss();
  }

  getTotal() {
    return this.products.reduce((i, j) => i + j.price * j.count, 0);
  }

}

