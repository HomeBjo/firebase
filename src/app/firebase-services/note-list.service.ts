import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import {
  Firestore,
  collection,
  doc,
  collectionData,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
} from '@angular/fire/firestore';
// import { doc, onSnapshot } from "firebase/firestore";  //kein plan das steht online
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {
  normalNotes: Note[] = [];
  trashNotes: Note[] = [];
  markedNotes: Note[] = [];

  // items$: any; // erste methode mit den items
  // items: any;

  unsubTrash; //zweite methode mit onsnapshot
  unsubSingle;
  unsubMarkedSingle;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubSingle = this.subNotesList();
    this.unsubTrash = this.subTrashList();

    this.unsubMarkedSingle = this.subMarkedNotesList();

    //   this.items$ = collectionData(this.getNotesRef()); // hier für erste methode
    //   this.items = this.items$.subscribe((list: any[]) => {
    //     list.forEach((element: any) => {
    //       console.log(element);
    //     });
    //   });
  }

  // const itemCollection=collection(this.firestore, 'items');

  async deleteNote(colId: string, docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      //ab   .catch  ist nen abfang funktion wegen den errors und meldungen
      (err) => {
        console.log(err);
      }
    );
  }

  async updaeNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColdIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note))
        .catch((err) => {
          console.log(err);
        })
        .then(); //  könnte man noch eine ausführung mit rein machen
    }
  }

  getCleanJson(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    };
  }

  getColdIdFromNote(note: Note): string {
    //:string muss nicht aber so kann man defenieren too
    if (note.type == 'note') {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  async addNote(item: Note, callId: 'notes' | 'trash') {
    let getCurrentValue;
    if (callId === 'notes') {
      getCurrentValue = this.getNotesRef();
    } else if (callId === 'trash') {
      getCurrentValue = this.getTrashRef();
    } else {
      throw new Error('Ungültiger callId-Parameter');
    }

    await addDoc(getCurrentValue, item)
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        console.log('Document written with ID', docRef?.id);
      });
  }

  ngonDestroy() {
    // this.items.unsubscribe();  // erste mehtode
    this.unsubSingle();
    this.unsubTrash();
  }

  subNotesList() {
    const q = query(this.getNotesRef(), limit(100)); // orderBy("title") anstatt orderby where("state", "==", "CA")
    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach((element) => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
        //     //   unsubTrash = onSnapshot(
        //   this.getSingleDocRef('notes', '21sasd561dd4sdf'),
        //   (element) => {}
        // );
      });

      // hier einfach von der doc mit rein gemacht zum loggen und status sehen usw
      list.docChanges().forEach((change) => {
        if (change.type === 'added') {
          console.log('New note: ', change.doc.data());
        }
        if (change.type === 'modified') {
          console.log('Modified note: ', change.doc.data());
        }
        if (change.type === 'removed') {
          console.log('Removed note: ', change.doc.data());
        }
      });
      // geht bis hier ist nen add+  nicht erforderlich
    });
  }

  subMarkedNotesList() {
    const q = query(
      this.getNotesRef(),
      where('marked', '==', true),
      limit(100)
    );
    return onSnapshot(q, (list) => {
      this.markedNotes = [];
      list.forEach((element) => {
        this.markedNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach((element) => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false,
    };
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
