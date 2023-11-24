import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGymComponent } from './admin-gym.component';

describe('AdminGymComponent', () => {
  let component: AdminGymComponent;
  let fixture: ComponentFixture<AdminGymComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminGymComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
