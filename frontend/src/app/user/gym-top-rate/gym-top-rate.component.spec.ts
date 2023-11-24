import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymTopRateComponent } from './gym-top-rate.component';

describe('GymTopRateComponent', () => {
  let component: GymTopRateComponent;
  let fixture: ComponentFixture<GymTopRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GymTopRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GymTopRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
