import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import {ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  ordersData = [];
  selectTabs: string = "preparing";
  testData: any[];
  orders: Observable<any[]>;



  constructor(
    private productService: ProductService,
    private afs: AngularFirestore,
    public route:ActivatedRoute
  ) {

  }



  ngOnInit() {

    this.orders = this.productService.getOrders();
  
  }


}
