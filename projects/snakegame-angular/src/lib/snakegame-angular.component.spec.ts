import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnakegameAngularComponent } from './snakegame-angular.component';

describe('SnakegameAngularComponent', () => {
  let component: SnakegameAngularComponent;
  let fixture: ComponentFixture<SnakegameAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnakegameAngularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnakegameAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
