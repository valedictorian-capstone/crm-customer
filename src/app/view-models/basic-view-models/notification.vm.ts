import { CustomerVM } from '@view-models';

export interface NotificationVM {
  id: string;
  notification: any;
  data: any;
  customer: CustomerVM;
  type: string;
  isSeen: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
