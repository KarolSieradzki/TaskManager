import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../../../core/services/task.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  taskForm: FormGroup;
  statusOptions = ['todo', 'in_progress', 'done'];
  priorityOptions = ['low', 'medium', 'high'];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    public router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      description: [''],
      status: ['todo', Validators.required],
      priority: ['medium'],
      due_date: [''],
      assigned_to: ['']
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.taskService.createTask(this.taskForm.value).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: err => alert('Error creating task: ' + err.message)
      });
    }
  }
}
