import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  selectTabs: string = "preparing";
  orders: Observable<any[]>;
  onTheWay: Observable<any[]>;
  received: Observable<any[]>;



  constructor(
    private productService: ProductService,
    private afs: AngularFirestore,
    public route:ActivatedRoute
  ) {

  }



  ngOnInit() {

    this.orders = this.productService.getOrders();

    this.onTheWay = this.productService.getOnTheWay();

    this.received = this.productService.getReceived();


  
  }

  receiveStatus(event, order){
    this.productService.receiveStatus(order.id);
  }
  
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }


}
