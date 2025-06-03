import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../../../../core/services/task.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-task-detail-dialog',
  templateUrl: './task-detail-dialog.component.html',
  styleUrls: ['./task-detail-dialog.component.scss']
})
export class TaskDetailDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { task: Task },
    private dialogRef: MatDialogRef<TaskDetailDialogComponent>,
    private taskService: TaskService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  deleteTask(): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(this.data.task.id).subscribe({
        next: () => {
          this.dialogRef.close('deleted');
        },
        error: () => {
          this.snackBar.open('Failed to delete task', 'Dismiss', { duration: 3000 });
        }
      });
    }
  }

  editTask(): void {
    this.dialogRef.close('edited');
    this.router.navigate(['/tasks', this.data.task.id, 'edit']);
  }
}
