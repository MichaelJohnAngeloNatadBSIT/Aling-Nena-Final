import { RegisterService } from './../../services/register.service';
import { AuthenticationService } from "./../../services/authentication.service";
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { UserInfo } from "../../services/shared/userInfo";
 
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  credentials: FormGroup;
 
  constructor(
    private fb: FormBuilder,
    private regService: RegisterService,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    public afStore: AngularFirestore,
  ) {}
 
  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required]],
      name: ['', [Validators.required]],
    },
    );
  }
 
  async register() {
    const loading = await this.loadingController.create();
    await loading.present();
    
    this.regService.register(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss(); 
        this.SetUserData(this.credentials.value);
        console.log(res);
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Register failed',
          message: res.error.error,
          buttons: ['OK'],
        });
 
        await alert.present();
      }
    );

  }

  SetUserData(credentials) {
    const id = this.afStore.createId();
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`usersInfo/${id}`);
    const userData: UserInfo = {
      uid: id,
      email: credentials.email,
      name: credentials.name,
      address: credentials.address
    }
    return userRef.set(userData, {
      merge: true
    })
  }

 
  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }
  
  get password() {
    return this.credentials.get('password');
  }

  get name() {
    return this.credentials.get('name');
  }

  get address() {
    return this.credentials.get('address');
  }
}