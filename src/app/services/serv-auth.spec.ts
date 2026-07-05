import { TestBed } from '@angular/core/testing';

import { ServAuth } from './serv-auth';

describe('ServAuth', () => {
  let service: ServAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServAuth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
