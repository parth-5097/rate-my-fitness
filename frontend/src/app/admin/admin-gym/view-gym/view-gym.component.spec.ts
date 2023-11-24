import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGymComponent } from './view-gym.component';

describe('ViewGymComponent', () => {
  let component: ViewGymComponent;
  let fixture: ComponentFixture<ViewGymComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGymComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
