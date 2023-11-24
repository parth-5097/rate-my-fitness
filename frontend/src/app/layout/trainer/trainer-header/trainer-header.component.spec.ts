import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerHeaderComponent } from './trainer-header.component';

describe('TrainerHeaderComponent', () => {
  let component: TrainerHeaderComponent;
  let fixture: ComponentFixture<TrainerHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainerHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
