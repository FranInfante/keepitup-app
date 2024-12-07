export interface Toast {
    id: number;
    show: boolean;
    body: string;
    type: 'success' | 'danger' | 'info';
  }