import { CustomerVM } from '@view-models';

export interface TicketVM {
  id: string;
  description: string;
  customer: CustomerVM;
  status: string;
  feedbackMessage: string;
  feedbackStatus: string;
  feedbackRating: number;
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketCM {
  description: string;
  customer: CustomerVM;
  status: string;
}

export interface TicketUM {
  id: string;
  description: string;
  customer: CustomerVM;
  status: string;
  feedbackAssignee: CustomerVM;
  feedbackMessage: string;
  feedbackStatus: string;
  feedbackRating: number;
}
