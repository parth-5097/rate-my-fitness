import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateTrainerComponent } from './rate-trainer.component';

describe('RateTrainerComponent', () => {
  let component: RateTrainerComponent;
  let fixture: ComponentFixture<RateTrainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateTrainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
