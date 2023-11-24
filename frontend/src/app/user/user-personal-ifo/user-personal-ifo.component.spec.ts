import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPersonalIfoComponent } from './user-personal-ifo.component';

describe('UserPersonalIfoComponent', () => {
  let component: UserPersonalIfoComponent;
  let fixture: ComponentFixture<UserPersonalIfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPersonalIfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPersonalIfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
