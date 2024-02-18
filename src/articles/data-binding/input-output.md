---
title: "Input & Output"
---

# Input & Output

`Input` და `Output` არიან დეკორატორები, რომელთა საშუალებითაც შეგვიძლია მონაცემები (data) და მოვლენები (events)
გადავცეთ ერთი კომპონენტიდან მეორეს. `Input`-ის საშუალებით შვილი კომპონენტი მშობელისგან იღებს
მონაცემს, ხოლო `Output`-ის საშუალებით შვილი კომპონენტი მოვლენას გადასცემს მშობელ კომპონენტს.

![input და output პრინციპების დიაგრამა](/assets/media/input-output.png)

სანიმუშოდ შექმნილი გვაქვს ანგულარის ახალი აპლიკაცია, სადაც შევქმენით კომპონენტი სახელად child.
ეს უკანასკნელი სელექტორით განვათავსეთ `app.component.html`-ში. `ChildComponent` გამოდის `AppComponent`-ის
შვილი.

## Input

გადავცეთ მშობელი კომპონენტიდან შვილ კომპონენტს ინფორმაცია. ამისთვის შვილ კომპონენტში ვქმნით თვისებას
`@Input` დეკორატორით, რომელიც `@angular/core`-დან უნდა დავაიმპორტოთ.

```ts
import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/core";

@Component({
  selector: "app-child",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./child.component.html",
  styleUrl: "./child.component.scss",
})
export class ChildComponent {
  @Input() message: string = "";
}
```

`message` ცვლადს ჩვენ ინიციალიზაციას ვუკეთებთ, როგორც ცარიელ სტრინგს.
ამის გარეშე, თუ ტაიპსკრიპტი მკაცრ რეჟიმზე გვაქვს, ქომფაილერში ერორი მოხდება.
რადგან ამ ფროფერთის ინფუთ დეკორატორით ჩვენ ვაცხადებთ, რომ მშობელიდან ველით
მონაცემს, რომელიც ამ ფროფერთიში შეინახება, ანგულარი დარწმუნებული უნდა იყოს, რომ
რაღაც მნიშვნელობა ამ ფროფერთის იმ შემთხვევაშიც ექნება, თუ მან მშობელისგან მონაცემი
არ მიიღო.

`message`-ს ჩვენ ამავე კომპონენტის თემფლეითში განვათავსებთ ინტერპოლაციით:

```html
<p>{{ message }}</p>
```

მშობელ კომპონენტში შევქმნათ მასივი `messages` რომელშიც შევინახავთ ორ სტრინგს:

```ts
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  messages = ["The first message", "The second message"];
}
```

მშობელი კომპონენტის თემფლეითში ფროფერთი ბაინდინგის საშუალებით შეგვიძლია
შვილის კლასში არსებულ სახელზე რაიმე მნიშვნელობების მიბმა:

```html
<app-child [message]="messages[0]"></app-child>
<app-child [message]="messages[1]"></app-child>
```

აქ ჩვენ ორი child კომპონენტი განვათავსეთ, სადაც პირველს message თვისებაზე
ვაბამთ `messages` მასივში არსებულ პირველ სტრინგს, ხოლო მეორე child კომპონენტს
ვაბამთ `messages` მასივში არსებულ მეორე სტრინგს. `message` ფროფერთი app-child-ზე
მშობელი კომპონენტიდან ხელმისაწვდომია სწორედ `@Input()` დეკორატორის წყალობით.
ასე child კომპონენტი თავის კლასში იმავე სახელის message თვისებაზე მიიღებს მშობელი
ელემენტიდან მიწოდებულ მნიშვნელობას, და მას თემფლეითში განათავსებს.

ტაიპსკრიპტის წყალობით ეს ფროფერთი მხოლოდ კონკრეტული ტიპის მონაცემს მიიღებს,
ანუ თუ ჩვენ `message` ფროფერთიზე სხვა ტიპის მნიშვნელობას მივაბამთ, ეს გამოიწვევს
ერორს:

```html
<!-- Error: cannot assign type number to type string -->
<app-child [message]="34"></app-child>
```

ასე ჩვენ მშობელი ელემენტიდან შვილ ელემენტს გადავცემთ ინფორმაციას.

## Output

`Output`-ის საშუალებით ჩვენ შეგვიძლია შევქმნათ მოვლენები, რომელსაც შეგვიძლია მშობელი
კომპონენტიდან მოვუსმინოთ (მაგალითად 'click' ივენთის მსგავსად).

ვთქვათ გვინდა, რომ შვილ კომპონენტში ღილაკზე დაჭერისას მშობელ კომპონენტს გადავცეთ
მესიჯის ტექსტის სიგრძე. ჯერ შევქმნათ ღილაკი, რომელზე დაკლიკებასაც მოვუსმენთ და
საპასუხოდ დავუძახებთ რამე მეთოდს.

```html
<p>{{ message }}</p>
<button (click)="onCount()">Count Message Length</button>
```

შემდეგ გადავინაცვლოთ ts ფაილში. `Input`-ის მსგავსად
ჩვენ შვილ კომპონენტში უნდა შევქმნათ თვისება, `@Output` დეკორატორით, რომელიც
`@angular/core`-დან უნდა დავაიმპორტოთ. ამჯერად ჩვენ თვისების მნიშვნლობაში ახალი
`EventEmitter`-ის ინსტანციას ვინახავთ, რომელიც ასევე `@angular/core`-დან შემოგვაქვს.

```ts
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-child",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./child.component.html",
  styleUrl: "./child.component.scss",
})
export class ChildComponent {
  @Input() message: string = "";
  @Output() lengthCount = new EventEmitter<number>();

  onCount() {
    this.lengthCount.emit(this.message.length);
  }
}
```

`EventEmitter` არის ე.წ Generic ტიპის კლასი, რაც იმას ნიშნავს, რომ მასში დამატებითი
ტიპი უნდა შევფუთოთ. მარტივად რომ ვთქვათ, ტაიპსკრიპტმა იცის, რომ `EventEmitter` რაღაც
მოვლენას გასცემს, თუმცა არ იცის ეს მოვლენა შედეგად რა ტიპის მნიშვნელობას გვაძლევს.
რადგან ჩვენ რიცხვობრივი მნიშვნელობის გადაცემა გვინდა, ამიტომ
ჩვენ კუთხურ ფრჩხილებს შორის ვწერთ `number` ტიპს, რათა დავაზუსტოთ, რომ `EventEmiter`
`number` ტიპის მნიშვნელობას გადასცემს მშობელს.

`onCount` მეთოდში `EventEmitter`-ის ინსტანციაზე, ანუ `lengthCount`-ზე დავუძახებთ `emit` მეთოდს,
რომელშიც მესიჯის სიგრძეს გადავცემთ არგუმენტად. როცა ღილაკზე დავაკლიკებთ, `EventEmitter` `emit`
მეთოდის საშუალებით, ასე ვთქვათ, სიგნალს გასცემს მშობელ ელემენტს, რომ რაღაც მოვლენა მოხდა და
ეს მოვლენა შეიცავს ინფორმაციას.

მშობელ ელემენტზე ჩვენ ამ მოვლენას შეგვიძლია მოვუსმინოთ, click მოვლენის მსგავსად, ოღონდ
`lengthCount`-ზე, იმ თვისებაზე, რომელიც ჩვენ კლასში შევქმენით `Output` დეკორატორით:

```html
<app-child
  [message]="messages[0]"
  (lengthCount)="logLength($event)"
></app-child>
<app-child
  [message]="messages[1]"
  (lengthCount)="logLength($event)"
></app-child>
```

`$event` არის განსაკუთრებული (key) სიტყვა, რომლითაც შეგვიძლია მოვიხელთოთ ის მნიშვნელობა, რომელსაც
ივენთ ემითერი გასცემს და გადავცეთ ის ფუნქციას, რომლითაც ამ ივენთს მოვიხელთებთ. ეს ფუნქცია უბრალოდ
კონსოლში დალოგავს რიცხვს:

```ts
// In AppComponent
logLength(length: number) {
  console.log(length);
}
```

ყურადღება მიაქციეთ, რომ ჩვენ length პარამეტრს ექსპლიციტურად ვუწერთ მოსალოდნელ ტიპს.
შედეგად კონსოლში უნდა დავლოგოთ თითოეულ კომპონენტში არსებული მესიჯის სიგრძე.

შევაჯამოთ რა ხდება: ღილაკზე დაჭერისას აქტიურდება `onCount` მეთოდი, რომელიც `EventEmitter`-ის
საშუალებით აემითებს მესიჯის სიგრძეს. ამ ივენთს მოვიხელთებთ მშობელი ელემენტიდან შვილ ელემენტზე
ივენთ ბაინდინგით `lengthCount` თვისებაზე (რომელიც `Output` დეკორატორით შევქმენით). `$event`-ით
ჩვენ დაემითებულ მნიშვნელობას ვიღებთ და ვაწვდით `logLength` მეთოდს, რომელიც ამ მნიშვნელობას
კონსოლში ლოგავს.

## ngOnChanges - ცვლილებებზე რეაგირება

ჩვენ საშუალება გვაქვს, რომ შვილ კომპონენტში ვირეაგიროთ `@Input` თვისებაში შემოსულ ცვლილებებზე.
ამისთვის არსებობს `ngOnChanges` სიცოცხლის ციკლის ჰუკი.

```ts
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-child",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./child.component.html",
  styleUrl: "./child.component.scss",
})
export class ChildComponent implements OnChanges {
  @Input() message: string = "";
  @Output() lengthCount = new EventEmitter<number>();

  onCount() {
    this.lengthCount.emit(this.message.length);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.message) {
      console.log("მესიჯი განახლდა: ", changes.message.currentValue);
    }
  }
}
```

`ngOnChanges`-ში გვაქვს `SimpleChanges` ტიპის პარამეტრი რომელსაც ანგულარი გვაწვდის.
აქ თვისებების ფორმით ხელმისაწვდომია ყველა ჩვენი `@Input` დეკორატორით შექმნილი კლასის თვისება,
მათ შორის `message`. ოღონდ ეს უშუალოდ ის სტრინგი არ არის, რომელიც ჩვენ შევქმენით,
არამედ `SimpleChange` ტიპის ობიექტი, რომელსაც გააჩნია `currentValue`, `previousValue` და
სხვა თვისებები. `ngOnChanges` ყოველ ჯერზე გაეშვება, როცა მშობელზე მიბმული `@Input` თვისება
მნიშვნელობას შეიცვლის და ეს ახალი მნიშვნელობა ხელმისაწვდომია `currentValue`-ში.
თუ რაიმე თვისება არ შეცვლილა, ის `changes`-ზე არ იარსებებს, ამიტომ ჯერ უნდა დავრწმუნდეთ,
რომ ის არსებობს, სანამ მასზე ვირეაგირებთ.

`ngOnChanges` უნდა გამოვიყენოთ დიდი სიფრთხილით, რადგან აქ მძიმე ლოგიკის გამოყენება
აპლიკაციას შეანელებს.

## შეჯამება

ამ თავში ჩვენ განვიხილეთ `Input` და `Output` დეკორატორები. `Input` დეკორატორის საშუალებით
შვილ კომპონენტს გადავცემთ მნიშვნელობას მშობელი კომპონენტიდან, ხოლო `Output` დეკორატორის
საშუალებით შვილ კომპონენტზე ვქმნით ივენთის ემითერს, რომელიც კონკრეტულ მნიშვნელობებს
აემითებს. შვილის ივენთ ემითერს ჩვენ შეგვიძლია მშობელი ელემენტიდან მოვუსმინოთ და მოვიხელთოთ
დაემითებული მნიშვნელობები `$event`-ის საშუალებით. ჩვენ ასევე შეგვიძლია ვირეაგიროთ მშობლისგან
მოწოდებული მონაცემების ცვლილებებზე `ngOnChanges` ჰუკით.
