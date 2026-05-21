import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowsCrud } from './follows-crud';

describe('FollowsCrud', () => {
  let component: FollowsCrud;
  let fixture: ComponentFixture<FollowsCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowsCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(FollowsCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
