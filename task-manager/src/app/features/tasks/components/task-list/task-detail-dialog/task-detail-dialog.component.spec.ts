import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailDialogComponent } from './task-detail-dialog.component';

describe('TaskDetailDialogComponent', () => {
  let component: TaskDetailDialogComponent;
  let fixture: ComponentFixture<TaskDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskDetailDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
