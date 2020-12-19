export interface EventVM {
  id: string;
  code: string;
  name: string;
  image: string;
  description: string;
  dateStart: Date;
  timeStart: Date;
  dateEnd: Date;
  timeEnd: Date;
  isDelete: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventCM {
  code: string;
  name: string;
  image: string;
  description: string;
}

export interface EventUM {
  id: string;
  code: string;
  name: string;
  image: string;
  description: string;
}
