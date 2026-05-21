import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowsList } from './follows-list';

describe('FollowsList', () => {
  let component: FollowsList;
  let fixture: ComponentFixture<FollowsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowsList],
    }).compileComponents();

    fixture = TestBed.createComponent(FollowsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
