import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateThisGymComponent } from './rate-this-gym.component';

describe('RateThisGymComponent', () => {
  let component: RateThisGymComponent;
  let fixture: ComponentFixture<RateThisGymComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateThisGymComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateThisGymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
