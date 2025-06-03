import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../../../core/services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {
  taskForm!: FormGroup;
  statusOptions = ['todo', 'in_progress', 'done'];
  priorityOptions = ['low', 'medium', 'high'];
  taskId!: number;
  loading = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      description: [''],
      status: ['todo', Validators.required],
      priority: ['medium'],
      due_date: [''],
      assigned_to: ['']
    });

    this.taskService.getTask(this.taskId).subscribe({
      next: (task: Task) => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          due_date: task.due_date,
          assigned_to: task.assigned_to
        });
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load task details', 'Dismiss', { duration: 3000 });
        this.router.navigate(['/tasks']);
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.taskService.updateTask(this.taskId, this.taskForm.value).subscribe({
        next: () => {
          this.snackBar.open('Task updated successfully', 'Dismiss', { duration: 3000 });
          this.router.navigate(['/tasks', this.taskId]);
        },
        error: () => {
          this.snackBar.open('Failed to update task', 'Dismiss', { duration: 3000 });
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/tasks', this.taskId]);
  }
}
