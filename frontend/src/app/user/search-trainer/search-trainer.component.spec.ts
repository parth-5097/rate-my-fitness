import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTrainerComponent } from './search-trainer.component';

describe('SearchTrainerComponent', () => {
  let component: SearchTrainerComponent;
  let fixture: ComponentFixture<SearchTrainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchTrainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
