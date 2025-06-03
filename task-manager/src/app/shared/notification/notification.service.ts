import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private ws!: WebSocket;

  constructor(private ngZone: NgZone, private snackBar: MatSnackBar) {
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket('ws://localhost:8080');
    this.ws.onmessage = (event) => {
      this.ngZone.run(() => {
        const notif = JSON.parse(event.data);

        const headline = notif.headline || 'Notification';
        const body = notif.body || '';
        const eventType = notif.event || '';
        const task = notif.task || {};

        let panelClass = '';
        switch (eventType) {
          case 'created':
            panelClass = 'snackbar-success';
            break;
          case 'updated':
            panelClass = 'snackbar-info';
            break;
          case 'deleted':
            panelClass = 'snackbar-warn';
            break;
          default:
            panelClass = 'snackbar-default';
        }

        const message = `${headline}\n${body}`;

        this.show(message, 'Dismiss', 5000, panelClass);
      });
    };
  }

  show(message: string, action: string = 'Dismiss', duration: number = 5000, panelClass: string = '') {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: panelClass ? [panelClass] : undefined
    });
  }
}
