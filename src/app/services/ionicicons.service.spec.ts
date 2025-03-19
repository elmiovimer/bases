import { TestBed } from '@angular/core/testing';

import { IoniciconsService } from './ionicicons.service';

describe('IoniciconsService', () => {
  let service: IoniciconsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IoniciconsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
