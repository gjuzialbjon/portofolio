import { Injectable } from '@angular/core'
import { Hands } from '@app/core/enums/hands'
import { Phases } from '@app/core/enums/phase'
import { Steps } from '@app/core/enums/steps'
import { Card } from '@app/core/models/card'
import { BehaviorSubject } from 'rxjs'
import { single } from 'rxjs/operators'
import { PlayerThrow } from './enums/player-throw.interface'
import { HelpersService } from './helpers.service'

@Injectable({
  providedIn: 'root',
})
export class MurlanService {
  game = new BehaviorSubject<Steps | null>(null)
  rules: any[] = []

  cardsOnTable: Card[] = []
  playerCards: Card[] = []
  userOneCards: Card[] = []
  userTwoCards: Card[] = []
  userThreeCards: Card[] = []

  cardsOnTable$ = new BehaviorSubject<Card[]>([])
  playerCards$ = new BehaviorSubject<Card[]>([])
  userOneCards$ = new BehaviorSubject<Card[]>([])
  userTwoCards$ = new BehaviorSubject<Card[]>([])
  userThreeCards$ = new BehaviorSubject<Card[]>([])

  validThrow$ = new BehaviorSubject<boolean>(false)

  deckOfCards: Card[] = []

  lastThrownUser: number = -1 //* ID of user who played last
  currentTurnUser: number = 4 //* ID of user who is currently playing

  handOnTable = Hands.empty
  selectedPlayerHand!: Hands

  constructor(private helpers: HelpersService) {}

  throw(player: number, cards: Card[]) {
    // this.game.next({ player, cards })
  }

  throwPlayerCards() {
    let selected = this.playerCards.filter((c) => c.selected)

    let count = -(selected.length - 1) / 2
    selected.forEach((c) => {
      const el = document.getElementById('player' + c.value + c.suit) as HTMLLIElement
      el.style.marginLeft = count++ * 50 + 'px'
      c.throwing = true
    })

    this.validThrow$.next(false)
    this.handOnTable = this.selectedPlayerHand

    setTimeout(() => {
      selected.forEach((c) => {
        c.throwing = false
      })

      if (selected.length >= 5) {
        selected = this.helpers.isStraight(selected) as Card[]
      }

      this.cardsOnTable = [...selected]
      this.cardsOnTable$.next(this.cardsOnTable.slice())
      this.playerCards = this.playerCards.filter((c) => !c.selected)
      this.playerCards$.next(this.playerCards.slice())
      this.checkValidPlayerThrow()
    }, 1000)
  }

  //* Game start procedure
  startGame(rules: any[]) {
    this.rules = rules
    this.handOnTable = Hands.empty
    this.cardsOnTable = []
    this.deckOfCards = this.helpers.generateAndShuffleCards()

    this.cardsOnTable$.next(this.cardsOnTable)
    this.validThrow$.next(false)

    this.playerCards = this.deckOfCards.slice(0, 14)
    this.userOneCards = this.deckOfCards.slice(14, 27)
    this.userTwoCards = this.deckOfCards.slice(27, 40)
    this.userThreeCards = this.deckOfCards.slice(40, 54)

    this.sortPlayersCards()
  }

  toggleCard(index: number) {
    const newCards = JSON.parse(JSON.stringify(this.playerCards)) //* Deep copy
    newCards[index].selected = !this.playerCards[index].selected
    this.playerCards = newCards
    this.playerCards$.next(newCards)

    this.checkValidPlayerThrow()
  }

  checkValidPlayerThrow() {
    if (this.currentTurnUser !== 4) {
      this.validThrow$.next(false)
      return
    }

    let selected = this.playerCards.filter((c) => c.selected)

    //* Two jokers in one
    if (selected.length > 1 && selected.find((c) => c.value === 14)) {
      this.validThrow$.next(false)
      return
    }

    this.selectedPlayerHand = Hands.empty

    if (selected.length >= 5) {
      selected = this.helpers.isStraight(selected)
      if (selected.length > 1) {
        this.selectedPlayerHand = this.helpers.areCardsSameSuit(selected) ? Hands.flush : Hands.straight
      }
    } else if (selected.length >= 2 && selected.length <= 4 && this.helpers.areCardsSameValue(selected)) {
      this.selectedPlayerHand = selected.length //* Same as pair, triple or bomb
    } else if (selected.length == 1) {
      this.selectedPlayerHand = Hands.single
    }

    if (this.lastThrownUser !== 4) {
      if (this.handOnTable !== Hands.empty) {
        switch (this.selectedPlayerHand) {
          case Hands.single:
            if (this.handOnTable !== Hands.single || selected[0].value <= this.cardsOnTable[0].value) {
              this.selectedPlayerHand = Hands.empty
            }
            break
          case Hands.pair:
            if (this.handOnTable !== Hands.pair || selected[0].value <= this.cardsOnTable[0].value) {
              this.selectedPlayerHand = Hands.empty
            }
            break
          case Hands.triple:
            if (this.handOnTable !== Hands.triple || selected[0].value < this.cardsOnTable[0].value) {
              this.selectedPlayerHand = Hands.empty
            }
            break
          case Hands.bomb:
            if (this.handOnTable === Hands.bomb) {
              if (selected[0].value < this.cardsOnTable[0].value) {
                this.selectedPlayerHand = Hands.empty
              }
            } else if (this.handOnTable === Hands.flush) {
              this.selectedPlayerHand = Hands.empty
            }
            break
          case Hands.flush:
            if (this.handOnTable === Hands.flush) {
              if (selected[0].value <= this.cardsOnTable[0].value) {
                this.selectedPlayerHand = Hands.empty
              }
            } else {
              this.selectedPlayerHand = Hands.empty
            }
            break

          default:
            break
        }
      }
    }

    this.validThrow$.next(this.selectedPlayerHand !== Hands.empty)
  }

  //* Helpers
  sortPlayersCards() {
    this.playerCards.sort((x, y) => x.playValue - y.playValue)
    this.userOneCards.sort((x, y) => x.playValue - y.playValue)
    this.userTwoCards.sort((x, y) => x.playValue - y.playValue)
    this.userThreeCards.sort((x, y) => x.playValue - y.playValue)

    this.playerCards$.next(this.playerCards.slice())
    this.userOneCards$.next(this.userOneCards.slice())
    this.userTwoCards$.next(this.userTwoCards.slice())
    this.userThreeCards$.next(this.userThreeCards.slice())
  }

  //* Getters
  get Game() {
    return this.game.asObservable()
  }

  get UserOneCards() {
    return this.userOneCards$.asObservable()
  }

  get UserTwoCards() {
    return this.userTwoCards$.asObservable()
  }

  get UserThreeCards() {
    return this.userThreeCards$.asObservable()
  }

  get PlayerCards() {
    return this.playerCards$.asObservable()
  }

  get TableCards() {
    return this.cardsOnTable$.asObservable()
  }

  get ValidThrow() {
    return this.validThrow$.asObservable()
  }
}
