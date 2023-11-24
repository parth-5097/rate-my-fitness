import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindMyTrainerComponent } from './find-my-trainer.component';

describe('FindMyTrainerComponent', () => {
  let component: FindMyTrainerComponent;
  let fixture: ComponentFixture<FindMyTrainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindMyTrainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindMyTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
