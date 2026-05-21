import { TestBed } from '@angular/core/testing';

import { ServMarketJson } from './serv-market-json';

describe('ServMarketJson', () => {
  let service: ServMarketJson;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServMarketJson);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
