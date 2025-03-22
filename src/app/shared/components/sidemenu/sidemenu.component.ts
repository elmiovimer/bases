import { Component, inject, OnInit } from '@angular/core';
import {
  // IonContent,
  // IonHeader,
  IonMenuToggle,
  // IonTitle,
  // IonToolbar,
  // IonIcon,
  // IonButtons,
  // IonButton,
  IonLabel,
  IonItem,
  IonToggle,
  // IonRouterLink,
  MenuController, IonIcon, IonAvatar,
} from "@ionic/angular/standalone";
import { Models } from 'src/app/models/models';
import { UserService } from '../../../services/user.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../../firebase/authentication.service';
import { User } from '@angular/fire/auth';
import { SharedModule } from '../../shared.module';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
  standalone: true,

  imports: [
    IonAvatar, IonIcon,
    IonItem,
    IonLabel,
    // IonButton, IonButtons, IonIcon,
    // IonHeader,
    // IonContent,
    // IonToolbar, IonTitle,
    IonMenuToggle,
    RouterModule,
    CommonModule,
    // IonRouterLink,
    IonToggle,
    FormsModule,
    SharedModule]
})
export class SidemenuComponent  implements OnInit {

  private menuController: MenuController = inject(MenuController);
  private authenticationService: AuthenticationService = inject(AuthenticationService);
  private userService: UserService = inject(UserService);
  menu : Menu[] = []
  paletteToggle = false;
  user : User;
  userProfile : Models.Auth.UserProfile
  userSubscription : Subscription;

  admin : boolean = false;

  constructor() {
    this.initMenu();

    this.initDarkMode();


    this.userSubscription = this.userService.user$.subscribe(async res =>{
      this.user = res;
      this.userProfile = await this.userService.getUserProfile(this.user.uid);
      if(this.user){
        const roles = await this.userService.getRol();
        console.log('roles ->', roles);
        if (roles?.admin) {
          this.admin = true;

        }
        else{
          if(this.userProfile.roles?.admin){
            this.admin = true;
          }
          else{this.admin = false;}

        }



      }

    })
   }

  ngOnInit() {}

  initMenu(){
    this.menu = [
      {name: 'Buttons', enlace: '/buttons', icon: 'caret-forward-circle-outline'},
    ]
  }
  initDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Initialize the dark palette based on the initial
    // value of the prefers-color-scheme media query
    this.initializeDarkPalette(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkPalette(mediaQuery.matches));
  }

    // Check/uncheck the toggle and update the palette based on isDark
    initializeDarkPalette(isDark: any) {
      this.paletteToggle = isDark;
      this.toggleDarkPalette(isDark);
    }

   // Listen for the toggle check/uncheck to toggle the dark palette
   toggleChange(ev: any) {
    this.toggleDarkPalette(ev.detail.checked);
  }

   // Add or remove the "ion-palette-dark" class on the html element
   toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }

  salir() {
    this.authenticationService.logout();
  }

}

interface Menu {
  name: string;
  enlace: string;
  icon: string;
  roles?: Models.Auth.Rol[]
}
