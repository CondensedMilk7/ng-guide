# მარტივი routing

ჩვენ ჩეგვიძლია ახალი აპლიკაციის გენერაცია routing-ით.
შევქმნათ ორი მთავარი კომპონენტი, რომელზეც გადავინაცვლებთ
url-ის შეცვლით.

```sh
ng generate component first
```

```sh
ng generate component second
```

ახლა ისე ვქნათ, რომ `/first` მისამართზე გამოვაჩინოთ `FirstComponent`,
ხოლო `/second` მისამართზე - `SecondComponent`.

შევხედოდ წინასწარ გენერირებულ `app-routing.module.ts`-ს:

```ts
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

ჩვენ შემოგვაქვს `RouterModule` `@angular/router`-დან და მას იმპორტების
მასივში ვამატებთ forRoot მეთოდით, სადაც ჩვენ ვატანთ ჩვენი route-ების
მასივს. ეს მასივი არის Routes ტიპის. შემდეგ ჩვენ ამ როუთერმოდულს ვაექსპორტებთ,
რათა ის სხვა მოდულებისთვის გახდეს ხელმისაწვდომი. სადაც AppRoutingModule-ს
დავარეგისტრირებთ, იქ იმუშავებს აქ განსაზღვრული routing კონფიგურაცია.

ჩვენ `AppRoutingModule`-ს ვარეგისტრირებთ `AppModule`-ში:

```ts
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FirstComponent } from "./first/first.component";
import { SecondComponent } from "./second/second.component";

@NgModule({
  declarations: [AppComponent, FirstComponent, SecondComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

შესაძლებელია `RouterModule.forRoot()`-ის აქვე გამოყენება და routes ცვლადის
აქვე შექმნაც, მაგრამ ხშირად ამას ცალკე მოდულის ფაილში აკეთებენ. დავუბრუნდეთ
`AppRoutingModule`-ს და მივხედოთ კონფიგურაციას:

```ts
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FirstComponent } from "./first/first.component";
import { SecondComponent } from "./second/second.component";

const routes: Routes = [
  { path: "first", component: FirstComponent },
  { path: "second", component: SecondComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

routes-ის მასივში ვამატებთ ობიექტებს, სადაც შეგვიძლია შემდეგი
თვისებების განსაზღვრა:

- `path`: მისამართი, რომელზეც უნდა ჩავტვირთოთ სასურველი კომპონენტი.
  მიაქციეთ ყურადღება, რომ აქ თავიდან დახრილ ხაზს არ ვწერთ,
  თუმცა საუბარი გვაქვს სწორედ `/first` მისამართზე.
- `component`: აქ მივუთითებთ იმ კომპონენტის კლასს, რომელიც გვინდა
  რომ მოცემულ მისამართზე ჩაიტვირთოს.

ახლა გვჭირდება `AppComponent`-ის თემფლეითში `router-outlet`-ის განთავსება.
ასე ანგულარს ეცოდინება რომ აქ უნდა მისამართის მიხედვით განვათავსოთ კომპონენტები.

```html
<router-outlet></router-outlet>
```

ახლა თავიდან ბრაუზერში არაფერი გამოჩნდება, მაგრამ თუ ხელით შევცვლით მისამართს
`http://localhost:4200/first`-ზე ან `http://localhost:4200/second`-ზე, ვნახავთ,
რომ სათანადო კომპონენტების მარკაპს დავინახავთ.

რა თქმა უნდა, ამის ხელით შეცვლა არ გვინდა. უნდა არსებობდეს ნავიგაციის ლინკები.
`AppComponent`-ში შევქმნათ მინიმალური ჰედერი ნავიგაციით.

```html
<header>
  <nav>
    <ul>
      <li><a routerLink="/first" routerLinkActive="active">First</a></li>
      <li><a routerLink="/second" routerLinkActive="active"> Second</a></li>
    </ul>
  </nav>
</header>
<router-outlet></router-outlet>
```

`routerLink` არის ანგულარში `href`-ის ალტერნატივა. ყურადღება მიაქციეთ,
რომ აქ მისამართები `/`-ით იწყება. ამით ვაზუსტებთ, რომ გვინდა
`root` მისამართს + `/first` ლინკზე გადასვლა და არა
მიმდინარე მისამართს + `first`. ეს არის ის მისამართები, რომლებიც
როუთის კონფიგურაციაში მივუთითეთ `path` თვისებაზე.

ჰედერი ერთ ადგილას რჩება, ხოლო მის ქვეშ, აუთლეტის საშუალებით,
კომპონენტები იცვლება routerLink-ის წყალობით. აქვე შეგვიძლია გამოვიყენოთ
`routerLinkActive` თვისება, რომელსაც ვუწერთ ერთ ან მეტ კლასის
სახელს რომელიც ამ ელემენტს უნდა მიენიჭოს, როცა მომხმარებელი
ამ მისამართზეა. ჩვენ ელემენტებს `active` კლასი მიენიჭებათ.

დავუბრუნდეთ `AppRoutingModule`-ს და ჩვენი როუთების სიას.
ვთქვათ გვსურს, მომხმარებლის გადამისამართება: როცა
მომხმარებელი აპლიკაციას ხსნის, გვინდა რომ ის გადავამისამართოთ
`/first` გვერდზე.

```ts
const routes: Routes = [
  { path: "first", component: FirstComponent },
  { path: "second", component: SecondComponent },
  { path: "", redirectTo: "first", pathMatch: "full" },
];
```

ჩვენ ახლა მივუთითებთ, რომ მთავარ path-ზე, მომხმარებელი უნდა გადავამისამართოთ
`first`-ზე. რადგან `first` როუთი უკვე დარეგისტრირებული გვაქვს, მისი კომპონენტი
ჩაიტვირთება. `pathMatch` გულისხმობს `path`-ის რა ნაწილი უნდა ემთხვეოდეს მიმდინარე
მისამართზე. ვინაიდან ჩვენ აქ ცარიელ სტრინგს მივუთითებთ, რაც მთავარი გვერდია,
`pathMatch`-ის `full`-ზე დაყენების გარეშე ანგულარი ნებისმიერი მისამართიდან გადაგვიყვანდა
`first`-ზე თუკი ის `path`-ში მითითებულ პატერნს შეიცავს. ცარიელ სტრინგს ყველა მისამართი
შეიცავს, ამიტომ ეს პრობლემური იქნებოდა. `pathMatch: "full" `-ით ვამბობთ, რომ თუკი
მთლიანი მისამართი არის `""`, მაშინ მოხდეს გადამისამართება.

ახლა, როგორც კი აპლიკაციას გავხსნით, მაშინვე `/first`-ზე ვიქნებით.

გაითვალისწინეთ, რომ როუთების თანმიმდევრობას მნიშვნელობა აქვს. ჩვენ უფრო სპეციფიკური
მისამართები უნდა მოვათავსოთ თავში, და მას უნდა მოჰყვეს ნაკლებად სპეციფიკური მისამართები.
მაგალითად, ჯერ `first/hello` და შემდეგ `first`.
ეს იმიტომ არის საჭირო, რომ ანგულარი პრიოერიტეტს ანიჭებს იმ მისამართს, რომელიც მას
მასივში პირველად შეხვდება.

### შეჯამება

ამ თავში ჩვენ ვისაუბრეთ მარტივ როუთინგზე. ანგულარში გვაქვს საშუალება, რომ მისამართის
ცვლილებებზე რეაგირება მოვახდინოთ და შევცვალოთ view, ანუ ის კომპონენტები გამოვსახოთ
ან გავაქროთ. ჩვენ როუთებს ვარეგისტრირებთ `Routes` ტიპის ცვლადში, სადაც ვუთითებთ,
რა მისამართზე რა კომპონენტი უნდა ჩაიტვირთოს. შემდეგ ჩვენ ამ როუთებს ვარეგისტრიტებთ
იმპორტების სიაში `RouterModule`-ის შემოტანით, და მასზე `forRoot` მეთოდში ჩვენი
როუთების მიწოდებით. იმ კომპონენტში, სადაც გვინდა რომ view-ები შეიცვალოს,
ვათავსებთ `router-outlet` ელემენტს, სადაც ანგულარი მისამართის მიხედვით
განათავსებს სათანადო კომპონენტებს.
