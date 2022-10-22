import { Component, OnInit } from '@angular/core'
import { Themes } from '@app/core/enums/themes'
import { ThemeService } from '@app/core/layout/theme.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { MurlanService } from '../../murlan.service'
import { Card } from '../cards/cards.component'
import { RulesComponent } from '../rules/rules.component'

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [],
})
export class TableComponent implements OnInit {
  suits = ['spade', 'diamond', 'heart', 'club']
  values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  cards: Card[] = []
  selectedCount = 0
  selectedCards: Card[] = []
  selectedCardsLI: HTMLLIElement[] = []
  cards2: Card[] = []

  constructor(private murlan: MurlanService, private modalService: NgbModal, private themeService: ThemeService) {}

  ngOnInit(): void {
    this.shuffle()
    this.openRules()
    this.murlan.Game.subscribe((res) => {
      // console.log(res)
    })
  }

  openRules() {
    const modalRef = this.modalService.open(RulesComponent, {
      scrollable: true,
      centered: true,
    })
    modalRef.componentInstance.name = 'World'
  }

  shuffle() {
    this.cards2 = [
      // {
      //   value: 10,
      //   suit: 'diamond',
      //   selected: false,
      // },
      // {
      //   value: 10,
      //   suit: 'diamond',
      //   selected: false,
      // },
      // {
      //   value: 10,
      //   suit: 'diamond',
      //   selected: false,
      // },
    ]
    this.cards = []
    this.selectedCount = 0
    this.generateCards()

    // Shuffle cards
    this.cards.sort(() => 0.5 - Math.random())

    // Get hand portion
    this.cards = this.cards.slice(0, 14)
  }

  generateCards() {
    for (let s = 0; s < this.suits.length; s++) {
      for (let v = 0; v < this.values.length; v++) {
        const value = this.values[v]
        const suit = this.suits[s]
        this.cards.push({ value, suit })
      }
    }

    const blackJoker = { value: 14, suit: 'club' }
    const redJoker = { value: 14, suit: 'heart' }

    this.cards.push(...[redJoker, blackJoker])
  }

  throw() {
    let count = -(this.selectedCardsLI.length - 1) / 2
    this.selectedCardsLI.forEach((c, i) => {
      c.classList.add('throwing')
      c.style.marginLeft = count++ * 50 + 'px'

      setTimeout(() => {
        c.classList.remove('throwing')

        if (i === this.selectedCardsLI.length - 1) {
          this.moveToTable()
        }
      }, 1000)
    })

    setTimeout(() => {
      // this.murlan.throw(Math.floor(Math.random() * 3) + 1, this.selectedCards)
      this.murlan.throw(2, this.selectedCards)
    }, 1000)
  }

  moveToTable() {
    this.cards = this.cards.filter((c) => !c.selected)
    this.cards2 = this.selectedCards
  }

  changedSelected(cards: Card[]) {
    console.log('Selected cards ', cards)
    const selectedCardsLI: HTMLLIElement[] = []

    for (const card of cards) {
      selectedCardsLI.push(document.getElementById(card.value + card.suit) as HTMLLIElement)
    }

    this.selectedCards = cards
    this.selectedCardsLI = selectedCardsLI

    console.log('Selected LI', selectedCardsLI)
  }
}
