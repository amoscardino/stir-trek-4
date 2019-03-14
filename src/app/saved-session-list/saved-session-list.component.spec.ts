import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedSessionListComponent } from './saved-session-list.component';

describe('SavedSessionListComponent', () => {
  let component: SavedSessionListComponent;
  let fixture: ComponentFixture<SavedSessionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedSessionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedSessionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
