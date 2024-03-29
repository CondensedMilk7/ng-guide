---
title: "Subjects"
---

# Subjects

საბჯექთი მნიშვნელოვანი ხელსაწყოა ანგულარის ეკოსისტემაში,
რომელიც გვეხმარება, რომ აპლიკაციის მდგომარეობა ვმართოთ
რეაქტიულად.

საბჯექთები არიან ე.წ "hot observables" ან "multicast observables".
ჩვეულებრივი სტრიმი არის ცივი (ან unicast), რაც იმას ნიშნავს, რომ
სტრიმი, როგორც ერთი პროდიუსერი, უკავშირდება მხოლოდ ერთ კონსუმერს.
ანუ იქმნება ერთი წყარო და ამ წყაროს ერთი მიმღები. საბჯექთები, რომლებიც
unicast, ანუ ცხელი სტრიმები არიან წარმოადგენენ პროდიუსერს, რომელსაც
შეიძლება გააჩნდეს ერთზე მეტი კონსუმერი. ანუ საბჯექთით შეგვიძლია შევქმნათ
ერთი სტრიმი, რომელსაც ბევრი სხვადასხვა ადგილიდან დავაკვირდებით.

## ჩვეულებრივი Subject

შევქმნათ ანგულარის საწყის აპლიკაციაში მარტივი საბჯექთი:

```ts
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subject } from "rxjs";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  mySubject$ = new Subject<string>();

  onClick() {
    this.mySubject$.next("hello!");
  }
}
```

ჩვენ ვაიმპორტებთ `rxjs`-დან `Subject`-ს და მის ინსტანციას ვინახავთ
`mySubject$` თვისებაში. აქ ასევე შეგვიძლია მივუთითოთ საბჯექთი რა
ტიპის მნიშვნელობებს გასცემს. ეს სანიმუშოდ იყოს სტრინგი.
საბჯექთების საშუალებით ჩვენ შეგვიძლია ჩვენით გავცეთ სტრიმში
მნიშვნელობები. მაგალითად `onClick` მეთოდში სტრიმში გავცეთ
სტრინგი, რომელსაც ჩვენ `next` მეთოდის საშუალებით ვაკეთებთ.

თემფლეითში ეს ფუნქცია ღილაკს დავუკავშიროთ:

```html
<button (click)="onClick()">Click me</button>
```

ასე ჯერჯერობით არაფერი მოხდება. ჩვენ საბჯექთში კი გავცემთ
ახალ მონაცემს, მაგრამ ჩვენ მას არსად არ ვუსმენთ! მასზე შეგვიძლია
დავასუბსქრაიბოთ თემფლეითში `async` ფაიფით, თუმცა ჯერ უბრალოდ
`ngOnInit` შემოვიტანოთ და მასზე აქ დავასუბსქრაიბოთ.

```ts
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subject } from "rxjs";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  mySubject$ = new Subject<string>();

  ngOnInit(): void {
    this.mySubject$.subscribe((result) => {
      console.log(result);
    });
  }

  onClick() {
    this.mySubject$.next("hello!");
  }
}
```

ახლა ყოველ დაკლიკებაზე ჩვენ დავანექსთებთ სტრიმში "hello"
მნიშვნელობას, რომელიც კონსოლში დაილოგება.

ახლა მისი მნიშვნელობა თემფლეითშიც გავიტანოთ `async` ფაიფით.

```html
<button (click)="onClick()">Click me</button>
<h1>{{ mySubject$ | async }}</h1>
```

ასე ღილაკზე დაკლიკება `h1` ელემენტშიც გამოსახავს
საბჯექთისთვის `next` მეთოდში მიწვდილ მნიშვნელობას.
ჩვენ გვაქვს ერთი წყარო, `mySubject` რომელსაც ვუსმენთ
ორ ადგილას: კომპონენტის კლასში, `ngOnInit` ჰუკში და
კომპონენტის თემფლეითში, `async` ფაიფით. ანუ ერთ
წყაროს ჰყავს ორი კონსუმერი.

არსებობს უფრო კონკრეტული დანიშნულების მქონე საბჯექთები:
`ReplaySubject` და `BehaviorSubject`. ჩვენ ვისაუბრებთ მხოლოდ
`BehaviorSubject`-ზე, რადგან `ReplaySubject` საკმაოდ სპეციფიკურია
და ის იშვიათად თუ დაგჭირდებათ. მის შესახებ შეგიძლიათ თქვენით
მოიძიოთ ინფორმაცია.

## BehaviorSubject

`BehaviorSubject` არის იგივე საბჯექთი, თუმცა მას ჩვეულებრივი
საბჯექთისგან ის განასხვავებს, რომ გააჩნია საწყისი მნიშვნელობა.
მას ინიციალიზაციის დროს კონსტრუქტორში ვაწვდით ამ მნიშვნელობას:

```ts
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  mySubject$ = new BehaviorSubject<string>("Initial Value");

  ngOnInit(): void {
    this.mySubject$.subscribe((result) => {
      console.log(result);
    });

    setTimeout(() => {
      this.mySubject$.subscribe((result) => {
        console.log("Delayed subscription", result);
      });
    }, 5000);
  }

  onClick() {
    this.mySubject$.next("hello!");
  }
}
```

ახლა ამ საბჯექთზე დასუბსქრაიბებისას კონსოლსა და თემფლეითში
მივიღებთ "Initial Value" ტექსტს, ხოლო ღილაკზე დაკლიკებით
ამ მნიშვნელობას მოყვება ახალი მნიშვნელობა "Hello".

ამ ტიპის საბჯექთზე დასუბსქრაიბება თავდაპირველად
ნებისმიერ შემთხვევაში დაგვიბრუნებს ბოლოს გაცემულ მნიშვნელობას,
ასეთის არსეობის შემთხვევაში. ჩვეულებრივ საბჯექთზე დასუბსქრაიბებისას
შედეგს ამ საბსქრიბშენში მხოლოდ მაშინ მივიღებთ, თუ საბჯექთზე `next`
მეთოდი გააქტიურდება დასუბსქრაიბების შემდეგ. `BehaviorSubject`-ით,
თუ `next` მეთოდი დასუბსქრაიბებამდე გააქტიურდა, დასუბსქრაიბებისას
მასში მიწოდებული უკანასკნელი მონაცემი დაგვიბრუნდება.

აქ ჩვენ ვქმნით დამატებით საბსქრიბშენს, რომელიც აპლიკაციის ინიციალიზებიდან
5 წამის დაგვიანებით შეიქმნება. თუ ჩვენ მაქამდე დავაკლიკებთ ღილაკს, მიმდინარე
საბსქრიფშენები მას დააფიქსირებენ, მაგრამ როგორც კი დაგვიანებული საბსქრიფშენი
შეიქმნება, სტრიმში უკანასკნელ მნიშვნელობას ისიც დალოგავს.

ჩვეულებრივი საბჯექთის შემთხვევაში ეს არ მოხდებოდა და დაგვიანებული საბსქრიბშენი
ახალი მონაცემის დაემიტების მოლოდინის რეჟიმში იქნებოდა.
