---
title: "DI-ის გამოყენებით"
---

# DI-ის გამოყენებით

ვთქვათ ეს ორი შვილი კომპონენტი გახდა კომპლექსური. მათ ბევრი ცალკეული
შვილი კომპონენტი ჰყავთ, რომლებსაც მენეჯმენტი უნდა გაუკეთონ. ლოგიკის რაღაც ნაწილი,
კერძოდ გმირებზე ინფორმაციის მანიპულაცია ძალიან განმეორებადი იქნებოდა თითოეულ
კომპონენტში. ამ კომპონენტებს ისევ პრიმიტიულად დავტოვებთ, მაგრამ გამოვიყენებთ
სერვისებს, რაც ჩვენი გმირების შესახებ ინფორმაციასთან დაკავშირებულ ლოგიკას
ერთ ადგილას მოუყრის თავს, ხოლო მის გამოყენებას ბევრ სხვადასხვა კომპონენტში შევძლებთ.

app.component.ts ახლა ასე გმაოიყურება:

```ts
import { Component } from "@angular/core";
@Component({
  selector: "app-root",
  template: `
    <div class="container">
      <app-hero-list></app-hero-list>
      <app-hero-details></app-hero-details>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 600px;
        display: grid;
        grid-template-columns: 300px 300px;
        grid-auto-rows: minmax(300px, auto);
      }

      .container > * {
        border: 2px solid black;
        padding: 8px;
      }
    `,
  ],
})
export class AppComponent {}
```

აქ არანაირი ლოგიკა აღარ გვექნება, სანაცვლოდ გმირებზე ლოგიკას გავიტანთ სერვისში.
ვქმნით ფაილს hero.service.ts:

```ts
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Hero } from "./types/hero";

@Injectable({ providedIn: "root" })
export class HeroService {
  heroes: Hero[] = [
    {
      name: "Tariel",
      description:
        "Tariel is distinguished by his wild character as symbolized by his wearing the panther's skin.The qualities associated with the cat, his dedication and courage, his hatred and violence could be extreme and uncontrollable.",
    },
    {
      name: "Avtandil",
      description:
        "Avtandil, the knight and commander-in-chief of Rostevan's armies. One day, Avtandil challenges King Rostevan to a hunting competition. After three days of shooting game, they encounter a knight crying by a river.",
    },
    {
      name: "Nuradin-Pridon",
      description:
        "Nuradin-Pridon, ruler of Mulgazanzar. He initially met Tariel after he survived a battle against traitors who tried to ambush him. After sharing their stories, Nuradin-Pridon gifted Tariel his trusty Arabian steed to aid him in his journey.",
    },
  ];

  pickedHero$ = new BehaviorSubject<Hero>(this.heroes[0]);

  pickHero(hero: Hero) {
    this.pickedHero$.next(hero);
  }
}
```

კონვენციურად სახელში ასეთ კლასებსა და ფაილებს `service` ეწერებათ, რადგან
ისინი, ასე ვთქვათ, სხვადასხვა კლასებს "ემსახურებიან". სერვისები `Injectable`
დეკორატორით იქმნებიან, რათა ანგულარის ე.წ `Injector`-მა ამ კლასების dependency
injection შეძლოს. აქ შეგვიძლია `providedIn` კონფიგურაციის მიწოდება, რომელიც
განსაზღვრავს თუ აპლიკაციის რა ნაწილებში უნდა იყოს ხელმისაწვდომი ეს სერვისი.
`root` გულისხმობს აპლიკაციის ფესვს, ანუ ის `app-root`-ში, ესეიგი ყველგან იქნება
ხელმისაწვდომი.

შესაძლებელია სერვისი მხოლოდ კონკრეტული მოდულის ფარგლებშიც გავხადოთ
ხელმისაწვდომი. მაშინ `providedIn` კონფიგურაციის მაგივრად, ეს კლასი უნდა
შევიტანოთ `NgModule`-ის `providers` მასივში:

```ts
import { HeroService } from './hero.service.ts'
@NgModule({
  // ... declarations, imports, etc.
  providers: [HeroService],
})
```

თუ მხოლოდ კონკრეუტლი კომპონენტებისთვის გვინდა ეს კლასი, მაშინ სეგვიძლია
`Component` დეკორატორში მისი `providers` მასივში დამატებაც:

```ts
import { HeroService } from './hero.service.ts'
@Component({
  // ... selector, template, etc.
  providers: [HeroService]
})
```

ამ შემთხვევაში ჩვენ`{providedIn: 'root'}`-ს დავტოვებთ.

გმირების მასივს ახლა ჩვენ აქ შევინახავთ და ასევე გმირის არჩევის ლოგიკასაც.
სერვისში ვქმნით `pickedHero$` თვისებას. ეს არის BehaviorSubject-ის ინსტანცია,
რომელიც `'rxjs'`-დან უნდა დავაიმპორტოთ. სტრიმებს კონვენციურად ბოლოში
`$`-ს უწერენ ჩვენ სტრიმებს სხვა თავებში ვისწავლით,
მაგრამ ახლა უბრალოდ უნდა ვიცოდეთ, რომ ეს ერთგვარი მოვლენების ნაკადია, რომელსაც
ჩვენ შეგვიძლია მოვუსმინოთ და მასზე რეაგირება მოვახდინოთ. ჩვენ აღვნიშნავთ, რომ
ეს საბჯექთი `Hero` ტიპის მნიშვნელობას გასცემს და მას ფუნქციის არგუმენტად ვატანთ
მასივში პირველ გმირს, რომელიც მისი საწყისი მნიშვნელობა იქნება.

```ts
  pickedHero$ = new BehaviorSubject<Hero>(this.heroes[0]);

  pickHero(hero: Hero) {
    this.pickedHero$.next(hero);
  }
```

ყოველ ახალ გმირის არჩევაზე, ანუ როცა `pickedHero`-ს დავუძახებთ, ჩვენ პარამეტრში
არსებულ გმირს გადავცემთ ამ `pickedHero$` საბჯექთს. მასზე `next` მეთოდი ნაკადში
ახალი გმირის მნიშვნელობას გადასცემს.

`HeroListComponent`-ში ჩვენ კონსტრუქტორში ვაცხადებთ, რომ კლასი დამოკიდებულია
`HeroService`-ის ინსტანციაზე, რომელსაც ჩვენ `public` თვისება `heroService`-ში შევინახავთ.
ეს კონსტრუქტორში თვისების შექმნის შემოკლებული ვარიანტია.

```ts
import { Component } from "@angular/core";
import { HeroService } from "../hero.service";

@Component({
  selector: "app-hero-list",
  template: `
    <h2>Pick the hero</h2>
    <ul>
      <li
        *ngFor="let hero of heroService.heroes"
        (click)="heroService.pickHero(hero)"
      >
        {{ hero.name }}
      </li>
    </ul>
  `,
  styles: [
    `
      li {
        cursor: pointer;
      }
      li:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class HeroListComponent {
  constructor(public heroService: HeroService) {}
}
```

თვისება იმიტომ არის public,
რომ იგი ხელმისაწვდომი იყოს კლასის გარეთ, კერძოდ თემფლეითში, სადაც პირდაპირ
სერვისიდან ვიღებთ გმირების მასივს და მას თეფლეითში განვათავსებთ. დაკლიკების
ივენთზე ჩვენ სერვისზე არსებულ `pickHero` მეთოდს დავუძახებთ.

`HeroDetailsComponent` კომპონენტშიც ჩვენ ამ სერვისზე ვაცხადებთ დამოკიდებულებას,
მაგრამ მას ახლა `private` თვისებაში ვინახავთ, რადგან აქ მას (პორობითად) მხოლოდ
კლასის შიგნით ვიყენებთ. აქ კონსტრუქტორშივე რაღაც საინტერესოს ვაკეთებთ:

```ts
import { Component } from "@angular/core";
import { HeroService } from "../hero.service";
import { Hero } from "../types/hero";

@Component({
  selector: "app-hero-details",
  template: `
    <div *ngIf="hero">
      <h2>{{ hero.name }}</h2>
      <p>{{ hero.description }}</p>
    </div>
  `,
})
export class HeroDetailsComponent {
  hero!: Hero;
  constructor(private heroService: HeroService) {
    this.heroService.pickedHero$.subscribe((hero) => {
      this.hero = hero;
    });
  }
}
```

ჩვენ `heroService`-ში არსებულ `pickedHero$`-ზე ვეძახით `subscribe` მეთოდს,
ასე ფაქტობრივად მნიშვნელობების ნაკადს "გამოვიწერთ" და ამ ნაკადში ყოველ
ახალ მნიშვნელობაზე ამ ფუნქციაში ჩაწერილი ქოლბექი გააქტიურდება, სადაც ჩვენ
ახალი გმირის მნიშვნელობას მივიღებთ. ჩვენ ამ მიღებულ `hero`-ს ვუტოლებთ ჩვენს
კლასში არსებულ `hero`-ს, რომლის დეტალებიც ტემფლეითში გამოისახება.

შევაჯამოთ აქ რა ხდება:

- `HeroListComponent`-ში გმირზე დაკლიკებისას აქტიურდება `HeroService`-ში მეთოდი,
  რომელიც `pickedHero` საბჯექტზე ააქტიურებს `next` მეთოდს, რაც ნაკადში ახალი გმირის
  მნიშვნელობას აბრუნებს - იმ გმირის, რომელიც ჩვენ მეთოდს მივაწოდეთ არგუმენტად.
- ვინაიდან ჩვენ `HeroDetailsComponent`-ში დავასუბსქრაიბეთ ამ საბჯექტზე, მასზე დაძახებული
  ყოველი `next` მეთოდი ააქტიურებს ჩვენ მიერ `subscribe`-ში განსაზღვრულ ქოლბექს, სადაც
  ახალი გმირის მნიშვნელობას ვიღებთ.
- ამ ახალი გმირის მნიშვნელობას ჩვენ კლასის თვისებაში ვინახავთ და გამოვსახავთ თემფლეითში.

ეს არ არის BehaviorSubject-ების და ზოგადად სტრიმების გამოყენების იდეალური მაგალითი, მაგრამ
აქ სტრიმები პირობითია. მთავარია დავინახოთ სერვისების ეფექტურობა: მათი საშუალებით გმირებთან
დაკავშირებული ლოგიკა ერთ ადგილას გავაერთიანეთ და მასზე გავხადეთ დამოკიდებული ორი
კომპონენტი. ეს ორივე კომპონენტი `HeroService`-ის ერთსა და იმავე ინსტანციას იყენებენ,
და ასე ვთქვათ ერთმანეთთან სინქრონიზირებულები არიან. ორივეს შეუძლია არსებული გმირების
სიისა და არჩეული გმირის შესახებ ინფორმაციის აღება ან მასზე რეაგირება.

ანგულარის უნიკალურობა სწორედ ამაში მდგომარეობს, dependency injection მისი უდიდესი
პლიუსია.
