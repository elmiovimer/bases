import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filetourl',
  standalone: false
})
export class FiletourlPipe implements PipeTransform {

  transform(file : File): string {
    return URL.createObjectURL(file);
  }

}
