import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCrud } from './table-crud';

describe('TableCrud', () => {
  let component: TableCrud;
  let fixture: ComponentFixture<TableCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(TableCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
