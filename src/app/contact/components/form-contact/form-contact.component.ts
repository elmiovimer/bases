import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Models } from 'src/app/models/models';

@Component({
  selector: 'app-form-contact',
  templateUrl: './form-contact.component.html',
  styleUrls: ['./form-contact.component.scss'],
  standalone: false,
})
export class FormContactComponent  implements OnInit {

  form : Models.Contact.formContactI = {
    email: '',
    name: '',
    phone: ''
  }
  private fb = inject(FormBuilder);
  datosForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', Validators.required],
    phone: ['', this.isValid],

  });

  loading : boolean = false;
  error : string = '';

  constructor() {
    //si quiero estar pendiente de los cambios de un input
    this.datosForm.controls['email'].valueChanges.subscribe(
      (inputWithChanges) =>{
        console.log(inputWithChanges)


      }
    );

    //si quiero cargar los compos del dataForm desde aqui
    this.loadInfo();
   }

  ngOnInit() {}

  loadInfo(){
    setTimeout(() => {
      this.datosForm.controls['phone'].setValue('123456780');
    }, 2000);
  }

  enviar(){
    
    if(!this.form.email){
      this.error += `ingrese su email \n
      `.replace(/\n/g, '<br>');;

    }
    if(!this.form.name){
      this.error += `ingrese su nombre
      `;

    }
    if(!this.form.phone){
      this.error += `ingrese su telefono
      `;

    }
    console.log(this.form)
  }

  enviarForm(){
    this.loading = true;
    console.log('datosForm ->', this.datosForm);
    if (this.datosForm.valid) {
      console.log(this.datosForm.value)
      
    }
    this.loading = false;

  }

  //funcion personalizado para los formControl aplicado en el formBuilder {{datosForm}}
  isValid(input : FormControl){
    console.log('input - >', input.value);
    if (input.value != 10) {
      return {mal:true};
      
    }
    return {}

  }

}
