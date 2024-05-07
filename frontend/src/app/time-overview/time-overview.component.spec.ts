import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeOverviewComponent } from './time-overview.component';

describe('TimeOverviewComponent', () => {
  let component: TimeOverviewComponent;
  let fixture: ComponentFixture<TimeOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
