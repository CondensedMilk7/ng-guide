---
title: "ფაიფის შექმნა"
---

# ფაიფის შექმნა

ამ თავში ვისწავლით ფაიფების შექმნას.

წინასწარ გამზადებული გვაქვს სტრინგების მასივი და საფილტრო სიტყვა, რომლის
მიხედვითაც გვინდა ამ მასივის გაფილტვრა:

```ts
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  filterKey = "";
  items = [
    "Some example text here",
    "Angular is an awesome framework",
    "ZA WARUDOO",
    "Learn Angular, it's worth it",
    "On step at a time",
  ];
}
```

თემფლეითში ეს მნიშვნელობები გამოსახული გვაქვს `NgIf` დირექტივით.
ასევე `NgModel` დირექტივის საშუალებით `filtlerKey` ში ვნახავთ ყოველ
ახალ ტექსტს, რომელსაც მომხმარებელი `input`-ში შეიყვანს:

```html
<p>filter</p>
<input type="text" [(ngModel)]="filterKey" />
<hr />
<p *ngFor="let item of items">{{ item }}</p>
```

როგორღაც, შეცვლილი `filterKey`-ს მიხედვით უნდა შევცვალოთ
`NgFor` დირექტივით დარენდერებული სია. სწორედ ამისთვის გამოგვადგება ფაიფი.

შევქმნათ ფაიფი, რომელიც ტექსტის მასივს გაფილტრავს ჩვენ მიერ მიწოდებული
საძიებო სიტყვის მიხედვით. ფაიფის შექმნა შეიძლება ხელით, ან ანგულარის
CLI-ს დახმარებით.

```
ng generate pipe my-filter
```

ანგულარი შექმნის ფაილს, რომელიც შეიცავს ჩვენი ფაიფის სახელს + `.pipe.ts`.
ამ ფაილში დაექსpორტებულია ჩვენი ფაიფის კლასი, რომელიც `Pipe` დეკორატორით
არის შექმნილი. ამ დეკორატორში შეგვიძლია ფაიფის კონფიგურაცია, მათ შორის იმ
სახელის, რომლითაც ამ ფაიფს თემფლეითში გამოვიყენებთ. ჩვენი ფაიფის კლასი
თავის მხრივ აუცილებლად იმპლემენტაციას უკეთებდეს `PipeTransform` ინტერფეისს.
`PipeTransform` ინტერფეისი საჭიროებს რომ კლასში არსებობდეს `transform` მეთოდი.
ეს მეთოდი ყველა ფაიფს გააჩნია, თუმცა ყველა მათგანი თავისებურად მუშაობს.
ჩვენც, რა თქმა უნდა, ის ჩვენ ამოცანას უნდა მოვარგოთ.

```ts
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "myFilter",
  standalone: true,
})
export class MyFilterPipe implements PipeTransform {
  transform(value: string[], filterKey: string): string[] {
    return value.filter((item) =>
      item.toLowerCase().includes(filterKey.toLowerCase())
    );
  }
}
```

`transform` მეთოდი ორ პარამეტრს იღებს, `value` არის ის მნიშვნელობა, რომელიც
უნდა გავფილტროთ, ხოლო მეორე პარამეტრიდან იწყება ის არგუმენტები, რომლელსაც
ჩვენ ფაიფის გამოყენებისას მივაწვდით. ჩვენ გვინდა, რომ გავფილტროთ სტგრინგების მასივი
რაღაც სიტყვის მიხედვით და ამიტომ ჩვენ დავაბრუნებთ გაფილტრული სტრინგების მასივს,
სადაც თითოეული ელემენტი (ლოუერქეისში) შეიცავს საფილტრო სიტყვას (ლოუერქეისში).

დარწმუნდით, რომ ჩვენი ფაიფი დამატებულია შესაბამისი კომპონენტის იმპორტების სიაში,
რათა მისი გამოყენება შევძლოთ:

```ts
/* ... */
import { MyFilterPipe } from "./my-filter.pipe";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, MyFilterPipe],
})
export class AppComponent {
  /* ... */
}
```

ახლა შეგვიძლია ფილტრის გამოყენება:

```html
<p>filter</p>
<input type="text" [(ngModel)]="filterKey" />
<hr />
<p *ngFor="let item of items | myFilter : filterKey">{{ item }}</p>
```

ჩვენი ფილტრის filter ფუნქციაში value არგუმენტი გამოდის items მასივი,
ხოლო filterKey პარამეტრი გამოდის ჩვენს კომპონენტში არსებული filterKey,
რომელსაც ngModel-ის საშუალებით მომხმარებლის მიერ შეყვანილი მნიშვნელობა ეძლევა
და ანგულარ `items`-ს ტრანსფორმაციას უკეთებს და აბრუნებს მასივს მხოლოდ იმ
ელემენტებიც, რომლებიც ველში შეყვანილ სიტყვას შეიცავენ.

## შეჯამება

ამ თავში ჩვენ შევქმენით ფილტრის ფაიფი, რომლითაც ტექსტის მასივი გავფილტრეთ
`NgIf` დირექტივში, `input` ველში შეყვანილი ტექსტის მიხედვით.
