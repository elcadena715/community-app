import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCrud } from './profile-crud';

describe('ProfileCrud', () => {
  let component: ProfileCrud;
  let fixture: ComponentFixture<ProfileCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
