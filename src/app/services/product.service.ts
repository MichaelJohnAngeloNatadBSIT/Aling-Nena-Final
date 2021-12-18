import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Storage } from '@capacitor/storage';
import firebase from 'firebase/compat/app';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { orders } from './shared/orders';


const CART_STORAGE_KEY = 'MY_CART';
 
const INCREMENT = firebase.firestore.FieldValue.increment(1);
const DECREMENT = firebase.firestore.FieldValue.increment(-1);
 
@Injectable({
  providedIn: 'root'
})


export class ProductService {

  
  cart = new BehaviorSubject({});
  cartKey = null;
  productsCollection: AngularFirestoreCollection;
  ordersCollection: AngularFirestoreCollection;
  onTheWayCollection: AngularFirestoreCollection;
  receivedCollection: AngularFirestoreCollection;

 
  constructor(private afs: AngularFirestore ) {
    this.loadCart();
    this.productsCollection = this.afs.collection('products');
    this.ordersCollection = this.afs.collection('orders');
    this.onTheWayCollection = this.afs.collection('onTheWay');
    this.receivedCollection = this.afs.collection('received');
    
  }
  
  getReceived(){
    console.log(this.receivedCollection.valueChanges());
    return this.receivedCollection.valueChanges({ idField: 'id' });
  }
 
  getProducts() {
    return this.productsCollection.valueChanges({ idField: 'id' });
  }

  getOrders(){
    return this.ordersCollection.valueChanges({ idField: 'id' });
  }

  getOnTheWay(){
    return this.onTheWayCollection.valueChanges({ idField: 'id' });
  }

 
 
  async loadCart() {

    const result = await Storage.get({ key: CART_STORAGE_KEY });
    
    if (result.value) {
      this.cartKey = result.value;
      
      this.afs.collection('carts').doc(this.cartKey).valueChanges().subscribe((result: any) => {
        // Filter out our timestamp
        delete result['lastUpdate'];
 
        this.cart.next(result || {});
      });
 
    } else {
      // Start a new cart
      const fbDocument = await this.afs.collection('carts').add({
        lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('new cart: ',fbDocument);
      this.cartKey = fbDocument.id;
      // Store the document ID locally
      await Storage.set({ key: CART_STORAGE_KEY, value: this.cartKey });
 
      // Subscribe to changes
      this.afs.collection('carts').doc(this.cartKey).valueChanges().subscribe((result: any) => {
        delete result['lastUpdate'];
        console.log('cart changed: ', result);
        this.cart.next(result || {});
      });
      
    }
  }

  
  addToCart(id) {
    
    // Update the FB cart
    this.afs.collection('carts').doc(this.cartKey).update({
      [id]: INCREMENT,
      lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
    });
   
    // Update the stock value of the product
    this.productsCollection.doc(id).update({
      stock: DECREMENT
    });
  }
   
  removeFromCart(id) {
    // Update the FB cart
    this.afs.collection('carts').doc(this.cartKey).update({
      [id]: DECREMENT,
      lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
    });
   
    // Update the stock value of the product
    this.productsCollection.doc(id).update({
      stock: INCREMENT
    });
  }
   
  async checkoutCart(totalAmount, products: any) {
    // Create an order this.cart.value
    console.log(...products);
    await this.afs.collection('orders').add({
      ...products
    });
    console.log(this.cart.value);
    // Clear old cart
    this.afs.collection('carts').doc(this.cartKey).set({
      // cartValue: this.cart.value,
      lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
      total: totalAmount
    });
  }

  async updateStatus(id) {
    // Create an order this.cart.value

    await this.afs.collection('onTheWay').doc(id).set({
      id : id
    });

    this.afs.collection('orders').doc(id).delete();
  }

  async receiveStatus(id) {
    // Create an order this.cart.value
    await this.afs.collection('received').doc(id).set({
      id : id
    });

    this.afs.collection('onTheWay').doc(id).delete();
  }



}

