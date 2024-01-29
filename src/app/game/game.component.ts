import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// import { MatDialogModule } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { GameInfoComponent } from '../game-info/game-info.component';
import { DocumentData, Firestore, addDoc, collection, collectionData, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    GameInfoComponent,
    FormsModule,
    MatInputModule,
    DialogAddPlayerComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})

export class GameComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  game: Game = new Game();
  currentGame = [];



  // items$;
  // items;
  itemsOnFirestore: (DocumentData | (DocumentData & {}))[] | undefined; // varijabla napravljena tako da sadrzaj sa firebase privremeno moze da se sacuva
  idOfRoute!: string;
  zaOnsnapshot;



  constructor(private router: ActivatedRoute, public dialog: MatDialog) { //uvezli smo ActivatedRoute
    this.router.params.subscribe((params) => {  //ovom funkcijom smo u mogucnosti da uzmemo id iz rute napisane u browseru
      this.idOfRoute = params['id']
      console.log("Route is:", params['id'])
    })
    //console.log('ovo je postojeci objekt Game', this.game);
    this.zaOnsnapshot = this.pokreniOnSnap();

    // this.items$ = collectionData(this.getGameRef());
    // this.items = this.items$.subscribe((list) => {


    // });

    //this.itemsOnFirestore = list;
    // this.items.unsubscribe();
  }


  pokreniOnSnap() {
    return onSnapshot(this.getSingleGameRef('games', this.idOfRoute), (list: any) => {

      console.log('Od onSnapshot-a', list.data()["players"]);
      const health: number = list.data()["players"];
      this.currentGame = list.data();
      let proba = list.data();
      console.log('List iz snapShota:', list.data()["stack"]);
      console.log('Ovo je Game iz funkcije onsnapShor', this.game);


      this.game.players = list.data().players;
      this.game.playedCards = list.data().playedCards;
      this.game.currentPlayer = list.data().currentPlayer;
      this.game.stack = list.data().stack;
      this.game.currentCard = list.data().currentCard;
      this.game.pickCardAnimation = list.data().pickCardAnimation;

    });

  }

  ngOnDeestroy() {
    this.zaOnsnapshot();
  }


  ngOnInit(): void {
    this.newGame();
    //this.createDocOnFirebase();
  }

  //ovde se "kacimo" na nas projekat na firebase-u koji se zove games
  getGameRef() {
    return collection(this.firestore, 'games');

  }

  getSingleGameRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }


  newGame() {
    this.game = new Game();
  }


  //opsti obrazac za cuvanje na firebase-u
  async addGameDoc(item: {}) {                                                     //
    await addDoc(this.getGameRef(), item).catch(                                   //
      (err) => {                                                                  // ovaj deo smo morali da prilagodimo u start-screen-componenti,
        console.log(err);                                                         // jer fakticki novu igru stvaramo tamo,  sa jedinstvenim id-jem!!!
      }).then(                                                                    //
        (docRef) => {                                                             //
          console.log('Document written by ID:', docRef?.id);                     //
        })                                                                        //
  }

  //funkcija koja sadrzaj game objekta prebacenog u JSON kaci na firebase koristeci funkciju addGameDoc
  createDocOnFirebase() {
    //let note = {"hallo":"welt"}                               // ovaj deo takodje, smo morali da prilagodimo u start-screen-componenti,
    this.addGameDoc(this.game.toJson());                        // jer fakticki novu igru stvaramo tamo,  sa jedinstvenim id-jem!!!

  }

// igra biva update-ovana
  async saveGame() {
    await updateDoc(this.getSingleGameRef('games', this.idOfRoute), this.game.toJson());


  }
  // async updateNote(note: Note) {
  //   if (note.id) {
  //    let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id)
  //    await updateDoc(docRef, this.getCleanJson(note)).catch( 
  //      (err)=> { console.log(err)}
  //    )
  //   }
  //  }




  takeCard() {
    console.log('Game', this.game);
    console.log('currentCard', this.game.currentCard);


    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop() ?? "";
      console.log(this.game.currentCard);
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();

      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);

    }

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      console.log('Kako se zoves:', name, 'Odakle si more:', this.game)
      if (name && name.length > 1) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }
}

