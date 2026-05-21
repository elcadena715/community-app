import { TestBed } from '@angular/core/testing';

import { ServReportsJson } from './serv-reports-json';

describe('ServReportsJson', () => {
  let service: ServReportsJson;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServReportsJson);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
