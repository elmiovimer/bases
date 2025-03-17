import { inject, Injectable } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular/standalone' 

@Injectable({
  providedIn: 'root'
})
export class InteractionsService {
  private loading : HTMLIonLoadingElement;
  private loadingController: LoadingController = inject(LoadingController);
  private toastController: ToastController = inject(ToastController)
  private alertController: AlertController = inject(AlertController)


  constructor() { }

  async showLoading(message : string = 'Loading...'){
    this.loading = await this.loadingController.create({
      message,
      backdropDismiss: true,
    });

    this.loading.present();
 
  }

  async dismissLoading(){
    if (this.loading) {
      await this.loading.dismiss();
    }
    this.loading = null;
  }
}
