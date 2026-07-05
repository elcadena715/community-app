import { TestBed } from '@angular/core/testing';

import { ServCommunityApi } from './serv-community-api';

describe('ServCommunityApi', () => {
  let service: ServCommunityApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServCommunityApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
