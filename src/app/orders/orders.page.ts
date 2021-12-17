import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import {ActivatedRoute} from '@angular/router';
// import { order } from '../services/shared/order';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
 
  ordersData : any;
  selectTabs: string = "preparing";
  testData: any[];
  orders: Observable<any[]>;

  constructor(
    private productService: ProductService,
    private afs: AngularFirestore,
    public route:ActivatedRoute
  ) { }

  ngOnInit() {


    this.orders = this.productService.getOrders();
    console.log(this.orders);

  }

  updateStatus(event, order){
    this.productService.updateStatus(order.id);
  }



}
