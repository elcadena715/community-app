import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessMessage } from './app-dialog';

describe('SuccessMessage', () => {
  let component: SuccessMessage;
  let fixture: ComponentFixture<SuccessMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessMessage],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessMessage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
