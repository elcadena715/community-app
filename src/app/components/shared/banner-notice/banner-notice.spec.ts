import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerNotice } from './banner-notice';

describe('BannerNotice', () => {
  let component: BannerNotice;
  let fixture: ComponentFixture<BannerNotice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerNotice],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerNotice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
