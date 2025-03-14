import { inject, Pipe, PipeTransform } from '@angular/core';
import { StorageService } from 'src/app/firebase/storage.service';

@Pipe({
  name: 'reftourl',
  standalone: true
})
export class ReftourlPipe implements PipeTransform {
  storageService : StorageService = inject(StorageService);

 async transform(ref :string) {
  const url =  await this.storageService.getDownloadUrl(ref);
  console.log('transform url ->' , url);
    return url;
  }

}
