import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { take } from 'rxjs/operators';
import { order } from '../services/shared/order';
import {ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  // orders: Observable<any[]>;
  // orders: Observable<any[]>;
  ordersData = [];
  selectTabs: string = "preparing";
  testData: any[];
  orders: Observable<any[]>;
  // orders : any[]


  constructor(
    private productService: ProductService,
    private afs: AngularFirestore,
    public route:ActivatedRoute
  ) {

  }

  // ionViewWillEnter()

  ngOnInit() {
    // this.ordersData = JSON.parse(this.route.snapshot.paramMap.get('orderObject'));

    // let foodRes = this.productService.getOrders();
    // foodRes.pipe().subscribe(res => {
    //   console.log(res);
    //   this.ordersData = [];
    //   res.forEach(item => {
    //       let a = item.payload.toJSON();
    //       console.log(a);
    //       a['$key'] = item.key;
    //       this.ordersData.push(a as order);
    //   })
    // })

    // Object.keys(this.ordersData).forEach(data=>{
    //     let ord = this.ordersData[data];
    //     console.log(ord[data]);
    // })
    this.orders = this.productService.getOrders();
    

    console.log(this.orders);

    // this.productService.getOrders().

    this.productService.getOrders().pipe().subscribe(allProducts => {
      this.testData = allProducts;

      // console.log(this.testData);
      // this.testData.forEach(function(data){
      //   console.log(data)
      // })

      // this.ordersData.push(...this.testData[0][0]);
      // console.log(this.ordersData);

      // for(let i = 0; i <= this.testData.length; i++){
      //   for(let j = 0; j <= this.testData[0][i].length; j++){
      //   this.ordersData.push(...this.testData[i][j]);
      //   console.log(this.testData[i][j]);
      //   console.log(this.ordersData);
      
      //   }
      // }
      //  console.log(this.testData[1])
      // this.testData.forEach(function(data){
      //   console.log(data[0].title)
      // })
      // for(let i = 0; i <= allProducts.length; i++){
      //   // this.testData.push(allProducts[i]);
      //   console.log(allProducts[i]);
      // }

      // console.log(this.testData);
      // this.testData.forEach(function(data){
      //   let i = 0;
      //   console.log(data[i].title);
      //   i =+ 1;
      // })
      
      // forEach(function(prop){
      //   const count = 0;
      //   console.log(prop[0].title);

      // })
    });




    // this.products = allProducts.filter(p => cartItems[p.id]).map(product => {
    //   console.log(product);
    //   return { ...product, count: cartItems[product.id] };
    // });

    // this.orders.subscribe(data=>{
    //   console.log(data);
    //   this.ordersData = data;
    // })
    // console.log(this.orders);

    // const ordersCollection = this.afs.collection(`orders/${ProductService}`).valueChanges(); 
  }


}
