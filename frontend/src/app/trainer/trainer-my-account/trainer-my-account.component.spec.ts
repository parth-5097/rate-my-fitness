import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerMyAccountComponent } from './trainer-my-account.component';

describe('TrainerMyAccountComponent', () => {
  let component: TrainerMyAccountComponent;
  let fixture: ComponentFixture<TrainerMyAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainerMyAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainerMyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
