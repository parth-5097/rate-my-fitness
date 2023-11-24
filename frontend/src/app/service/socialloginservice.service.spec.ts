import { TestBed } from '@angular/core/testing';

import { SocialloginserviceService } from './socialloginservice.service';

describe('SocialloginserviceService', () => {
  let service: SocialloginserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialloginserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
