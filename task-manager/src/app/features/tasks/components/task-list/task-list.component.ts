import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { TaskService } from '../../../../core/services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'title', 'description', 'status', 'priority', 'assigned_to', 'due_date', 'created_at', 'updated_at'
  ];
  dataSource = new MatTableDataSource<Task>([]);
  statusOptions = ['todo', 'in_progress', 'done'];
  priorityOptions = ['low', 'medium', 'high'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filterValues: Record<string, string> = {
    title: '',
    assigned_to: '',
    status: '',
    priority: ''
  };
  constructor(private taskService: TaskService) { }

   ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.dataSource.data = tasks;
      this.dataSource.filterPredicate = this.createFilter();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event, column: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValues[column] = filterValue.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  applySelectFilter(value: string, column: string) {
    this.filterValues[column] = value;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  createFilter(): (task: Task, filter: string) => boolean {
    return (task, filter) => {
      const searchTerms = JSON.parse(filter);
      return (!searchTerms.title || task.title.toLowerCase().includes(searchTerms.title))
        && (!searchTerms.assigned_to || (task.assigned_to || '').toLowerCase().includes(searchTerms.assigned_to))
        && (!searchTerms.status || task.status === searchTerms.status)
        && (!searchTerms.priority || task.priority === searchTerms.priority);
    };
  }
}
