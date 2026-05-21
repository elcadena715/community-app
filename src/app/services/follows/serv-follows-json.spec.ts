import { TestBed } from '@angular/core/testing';

import { ServFollowsJson } from '../follows/serv-follows-json';

describe('ServFollowsJson', () => {
  let service: ServFollowsJson;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServFollowsJson);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
