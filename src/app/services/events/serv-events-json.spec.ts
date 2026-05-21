import { TestBed } from '@angular/core/testing';

import { ServEventsJson } from './serv-events-json';

describe('ServEventsJson', () => {
  let service: ServEventsJson;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServEventsJson);
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});