import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindGymComponent } from './find-gym.component';

describe('FindGymComponent', () => {
  let component: FindGymComponent;
  let fixture: ComponentFixture<FindGymComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindGymComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindGymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
