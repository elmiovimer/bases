import { inject, Injectable } from '@angular/core';
import { LoadingController, ToastController, AlertController, IonicSafeString } from '@ionic/angular/standalone'

@Injectable({
  providedIn: 'root'
})
export class InteractionsService {
  private loading : HTMLIonLoadingElement;
  private alert : HTMLIonAlertElement;
  private loadingController: LoadingController = inject(LoadingController);
  private toastController: ToastController = inject(ToastController)
  private alertController: AlertController = inject(AlertController)
  mensajeError = 'Parece que ocurrió un problema. Por favor, inténtalo nuevamente. Si el inconveniente continúa, contacta a nuestro equipo de soporte para obtener ayuda.'
  mensajeEmptyFields = 'Para continuar, completa todos los campos obligatorios.'
  titleImportante = "⚠️ Importante";
  titleError = "⚠️ Error";
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

  async showToast(message : string, duration : number = 2000, position : "bottom" | "top" | "middle" = "bottom", color : string = 'dark'){
    const toast = await this.toastController.create({
      message,
      duration,
      position,
      color,
    });
    await toast. present()
  }

  async showAlert(header  : string, message : string, textCANCEL : string = null, textOK : string = "OK") : Promise<boolean>{
    return new Promise(async (resolve) => {
      let buttons = [];
      if (textCANCEL) {
        buttons.push({
          text: textCANCEL,
          role : 'cancel',
          handler : () =>{
            resolve(false)
          }

        })

      }
      buttons.push({
        text: textOK,

        handler : async () =>{
          resolve(true);
        }
      });
      const alert = await this.alertController.create({
        header,
        message: (new IonicSafeString(message)).value,
        // message,
        buttons,
        backdropDismiss : false
      });
      await alert.present();


    });
  }
}
