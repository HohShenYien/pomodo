import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatCalendarComponent } from './stat-calendar.component';

describe('StatCalendarComponent', () => {
  let component: StatCalendarComponent;
  let fixture: ComponentFixture<StatCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatCalendarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
