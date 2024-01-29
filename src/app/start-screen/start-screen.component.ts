import { Component, OnInit, inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from '../../models/game';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  game!: Game;
  constructor(private router: Router) {

  }
  ngOnInit(): void {

  }


  //opsti obrazac za cuvanje na firebase-u
  async newGame() {
    let game = new Game(); //varijabla koja za vrednost ima zapravo Game Object
    await addDoc(this.getGameRef(), game.toJson()).then( //then jer se izvrsava samo jednom!!
      (gameInfo: any) => {
        this.router.navigateByUrl('/game/' + gameInfo.id); // ovim radimo sa tzv rutama iz koje dobijamo i jedinstveni ID
      })
  }

  //ovde se "kacimo" na nas projekat na firebase-u koji se zove games
  getGameRef() {
    return collection(this.firestore, 'games');

  }
}
