import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NoteListComponent } from './note-list/note-list.component';
import { NoteComponent } from './note-list/note/note.component';
import { FormsModule } from '@angular/forms';
import { AddNoteDialogComponent } from './add-note-dialog/add-note-dialog.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NoteListComponent,
    NoteComponent,
    AddNoteDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp({"projectId":"danotes-f","appId":"1:921230384387:web:f3ac6f760f9e57f39b5d36","storageBucket":"danotes-f.appspot.com","apiKey":"AIzaSyAuZRc7iFhsLKYOmiByOed_2dRnn7mCnBw","authDomain":"danotes-f.firebaseapp.com","messagingSenderId":"921230384387","measurementId":"G-D1SN69FVEC"})),
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
// oberste ebene um alles einzubinden !!!  durch @Ng.... und imports kann man die sachen importieren 
// und woanders benutzen siehe 