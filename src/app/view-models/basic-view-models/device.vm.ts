import { CustomerVM } from '@view-models';
export interface DeviceVM {
  id: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  userAgent: string;
  env: string;
  customer: CustomerVM;
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface DeviceCM {
  id: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  userAgent: string;
  env: string;
  customer: CustomerVM;
}

export interface DeviceUM {
  id: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  userAgent: string;
  env: string;
  customer: CustomerVM;
}
