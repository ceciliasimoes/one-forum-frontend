import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersCard } from './filters-card';

describe('FiltersCard', () => {
  let component: FiltersCard;
  let fixture: ComponentFixture<FiltersCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltersCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
