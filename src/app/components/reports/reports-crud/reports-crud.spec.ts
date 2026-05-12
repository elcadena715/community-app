import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsCrud } from './reports-crud';

describe('ReportsCrud', () => {
  let component: ReportsCrud;
  let fixture: ComponentFixture<ReportsCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
