export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  assigned_to?: string;
  due_date?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}
