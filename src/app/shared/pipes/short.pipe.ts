import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'short',
  standalone: true
})
export class ShortPipe implements PipeTransform {

  transform(value: string, ...args: number[]): unknown {

    let maxLength = 100;
     if (args[0]) {
      maxLength = args[0]
     }
    if (value.length > maxLength) {
      return value.slice(0,maxLength) + ` ...`;
      
    }
    return value;
  }

}
