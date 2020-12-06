import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MessageVM } from '@view-models';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    protected readonly firestore: AngularFirestore,
    protected readonly httpClient: HttpClient
  ) { }
  getAllMessages = (id: string) => {
    return this.firestore.collection<MessageVM>('messages', (ref) => ref.where('roomId', '==', id)).snapshotChanges();
  }
  addMessage = (data: MessageVM) => {
    return this.firestore.collection<MessageVM>('messages').add(data);
  }
  removeMessage = (id: string) => {
    return this.firestore.collection<MessageVM>('messages').doc(id).delete();
  }
  callBot = (data: { sender: string, message: string }) => {
    return this.httpClient.post<{ recipient_id: string, text: string, custom: string }[]>(`${environment.bot}`, data);
  }
}
