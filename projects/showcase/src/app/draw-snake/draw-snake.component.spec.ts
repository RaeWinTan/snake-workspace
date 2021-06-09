import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawSnakeComponent } from './draw-snake.component';

describe('DrawSnakeComponent', () => {
  let component: DrawSnakeComponent;
  let fixture: ComponentFixture<DrawSnakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawSnakeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawSnakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
