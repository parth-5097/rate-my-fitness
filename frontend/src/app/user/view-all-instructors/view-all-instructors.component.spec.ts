import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllInstructorsComponent } from './view-all-instructors.component';

describe('ViewAllInstructorsComponent', () => {
  let component: ViewAllInstructorsComponent;
  let fixture: ComponentFixture<ViewAllInstructorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllInstructorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllInstructorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
