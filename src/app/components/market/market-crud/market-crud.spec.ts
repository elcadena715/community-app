import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketCrud } from './market-crud';

describe('MarketCrud', () => {
  let component: MarketCrud;
  let fixture: ComponentFixture<MarketCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
