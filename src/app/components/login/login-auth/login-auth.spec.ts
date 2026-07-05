import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAuth } from './login-auth';

describe('LoginAuth', () => {
  let component: LoginAuth;
  let fixture: ComponentFixture<LoginAuth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginAuth],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginAuth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
