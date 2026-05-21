import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsCrud } from './events-crud';

describe('EventsCrud', () => {

  let component: EventsCrud;
  let fixture: ComponentFixture<EventsCrud>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [EventsCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsCrud);

    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});