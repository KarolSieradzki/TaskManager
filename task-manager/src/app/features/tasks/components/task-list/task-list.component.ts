import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../../../core/services/task.service';
import { Task } from '../../models/task.model';
import { TaskDetailDialogComponent } from './task-detail-dialog/task-detail-dialog.component';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  displayedColumns: string[] = ['title', 'assigned_to', 'status', 'priority', 'due_date', 'actions'];

  private FAVORITES_KEY = 'favoriteTasks';
  favoriteTaskIds$ = new BehaviorSubject<number[]>(this.getFavoritesFromStorage());

  filterForm: FormGroup;
  filteredTasks$: Observable<Task[]> | undefined;
  tasks$ = this.taskService.getTasks(); //Observable<Task[]>

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      status: [''],
      assigned_to: [''],
      favoriteOnly: [false]
    });
  }

  ngOnInit(): void {
    this.filteredTasks$ = combineLatest([
    this.tasks$,
    this.favoriteTaskIds$,
    this.filterFormValueChanges()
  ]).pipe(
    map(([tasks, favoriteIds, filters]) => {
      let filtered = tasks;

      if (filters.favoriteOnly) {
        filtered = filtered.filter(task => favoriteIds.includes(task.id));
      }

      if (filters.status) {
        filtered = filtered.filter(task => task.status === filters.status);
      }

      if (filters.assigned_to) {
        filtered = filtered.filter(task =>
          (task.assigned_to || '').toLowerCase().includes(filters.assigned_to.toLowerCase())
        );
      }

      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(task =>
          (task.title && task.title.toLowerCase().includes(search)) ||
          (task.description && task.description.toLowerCase().includes(search))
        );
      }

      return filtered;
    })
  );
  }

  filterFormValueChanges() {
    return this.filterForm.valueChanges.pipe(startWith(this.filterForm.value));
  }

  openDetails(task: Task): void {
    const dialogRef = this.dialog.open(TaskDetailDialogComponent, {
      width: '400px',
      data: { task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'deleted') {
        this.removeFromFavorites(task.id);
        this.snackBar.open('Task deleted successfully', 'Dismiss', { duration: 3000 });
      }
      if (result === 'edited') {
        // this.loadTasks();
      }
    });
  }

  goToAdd(): void {
    this.router.navigate(['/tasks/add']);
  }

  toggleFavorite(id: number) {
    const current = this.favoriteTaskIds$.value;
    let updated: number[];
    if (current.includes(id)) {
      updated = current.filter(favId => favId !== id);
    } else {
      updated = [...current, id];
    }
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(updated));
    this.favoriteTaskIds$.next(updated);
  }

  isFavorite(id: number): boolean {
    return this.favoriteTaskIds$.value.includes(id);
  }

  getFavoritesFromStorage(): number[] {
    return JSON.parse(localStorage.getItem(this.FAVORITES_KEY) || '[]');
  }

  removeFromFavorites(id: number) {
    const current = this.favoriteTaskIds$.value;
    const updated = current.filter(favId => favId !== id);
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(updated));
    this.favoriteTaskIds$.next(updated);
  }
}
