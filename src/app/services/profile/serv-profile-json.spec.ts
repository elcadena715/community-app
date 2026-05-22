import { TestBed } from '@angular/core/testing';

import { ServProfileJson } from './serv-profile-json';

describe('ServProfileJson', () => {
  let service: ServProfileJson;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServProfileJson);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
