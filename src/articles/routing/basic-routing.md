---
title: "მარტივი routing"
---

# მარტივი routing

შევქმნათ ახალი ანგულარის აპლიკაცია და
ორი მთავარი კომპონენტი, რომელზეც გადავინაცვლებთ
url-ის შეცვლით.

```sh
ng generate component first
```

```sh
ng generate component second
```

ახლა ისე ვქნათ, რომ `/first` მისამართზე გამოვაჩინოთ `FirstComponent`,
ხოლო `/second` მისამართზე - `SecondComponent`.

თუ დააკვირდებით, ანგულარის ვორქსფეისში უნდა გვქონდეს `app.routes.ts`
ფაილი, სადაც ჩვენ რაუთინგის კონფიგურაცია შეგვიძლია. სწორედ აქ დავაიმპორტებთ
ჩვენ კომპონენტებს.

```ts
import { Routes } from "@angular/router";
import { FirstComponent } from "./first/first.component";
import { SecondComponent } from "./second/second.component";

export const routes: Routes = [];
```

`routes` არის ცვლადი, სადაც ჩვენ რაუთების კონფიგურაციას შევინახავთ.
ეს მასივი არის Routes ტიპის. ეს ცვლადი უნდა დავაექსპორტოთ
რათა ის გადავცეთ აპლიკაციის კონფიგურაციას, რომელიც ამ რაუთინგის
კონფიგურაციას აამუშავებს.

`app.config.ts`-ში პროვაიდერების მასივში არის ჩასმული
`provideRouter` ფუნქცია, რომელიც იღებს ჩვენთვის უკვე ნაცნობ `routes` ცვლადს.
ამ კოდს ანგულარის CLI წინასწარ გვიმზადებს, თუმცა თუ აპლიკაცია CLI-ით
არ შეგვიქმნია, ეს ხელით უნდა დავწეროთ.

```ts
import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
```

დავუბრუნდეთ `app.routes.ts`-ს და რაუთები განვსაზღვროთ.

```ts
import { Routes } from "@angular/router";
import { FirstComponent } from "./first/first.component";
import { SecondComponent } from "./second/second.component";

const routes: Routes = [
  { path: "first", component: FirstComponent },
  { path: "second", component: SecondComponent },
];
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

რადგან `router-outlet` standalone კომპონენტია, ის უნდა AppComponent-ის
იმპორტების მასივში დავამატოთ:

```ts
import { RouterOutlet } from "@angular/router";

@Component({
  standalone: true,
  imports: [RouterOutlet],
  /* ... */
})
export class AppComponent {}
```

ახლა თავიდან ბრაუზერში არაფერი გამოჩნდება, მაგრამ თუ ხელით შევცვლით მისამართს
`http://localhost:4200/first`-ზე ან `http://localhost:4200/second`-ზე,
სათანადო კომპონენტების მარკაპს დავინახავთ.

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

`routerLink` არის ანგულარის დირექტივი, როგორც ერთგვარი `href`-ის ალტერნატივა.
კომპონენტის იმპორტებში საჭირო იქნება `RouterLink`-ის დამატება `@angular/router`-დან.
თუ ანგულარის რაუტერიდან კომპონენტში ბევრ სხვადასხვა კლასს ვიყენებთ, შეგვიძლია პირდაპირ
`RouterModule`-ის შემოტანა, რათა ყველა დირექტივი, კომპონენტი თუ პროვაიდერი ერთიანად
ხელმისაწვდომი გახდეს:

```ts
import { RouterModule } from "@angular/router";
@Component({
  imports: [RouterModule],
})
```

`routerLink`-ში ყურადღება მიაქციეთ,
რომ მისამართები `/`-ით იწყება. ამით ვაზუსტებთ, რომ გვინდა
`root` მისამართს + `/first` ლინკზე გადასვლა და არა
მიმდინარე მისამართს + `first`. ეს არის ის მისამართები, რომლებიც
როუთის კონფიგურაციაში მივუთითეთ `path` თვისებაზე.

ჰედერი ერთ ადგილას რჩება, ხოლო მის ქვეშ, აუთლეტის საშუალებით,
კომპონენტები იცვლება routerLink-ის წყალობით. აქვე შეგვიძლია გამოვიყენოთ
`routerLinkActive` თვისება, რომელსაც ვუწერთ ერთ ან მეტ კლასის
სახელს რომელიც ამ ელემენტს უნდა მიენიჭოს, როცა მომხმარებელი
ამ მისამართზეა. ჩვენ ელემენტებს `active` კლასი მიენიჭებათ.

დავუბრუნდეთ `app.routes.ts`-ს და ჩვენი როუთების სიას.
ვთქვათ გვსურს, მომხმარებლის გადამისამართება: როცა
მომხმარებელი აპლიკაციას ხსნის, გვინდა რომ ის გადავამისამართოთ
`/first` გვერდზე.

```ts
export const routes: Routes = [
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

## Wildcard Route

ზოგჯერ გვაქვს ისეტი მისამართი, რომელზეც არანაირი კომპონენტის ჩატვირთვა
არ გვაქვს გათვლილი. ამ დროს მომხმარებელს უნდა ვაცნობოთ რომ გვერდი ვერ მოიძებნა.
ამისათვის შეგვიძლია შევქმნათ `page-not-fount` კომპონენტი:

```
ng g c page-not-found
```

და მის თემფლეითში რაღაც ასეთი დავწეროთ:

```html
<h1>Page Not Found</h1>
```

ახლა რაუთინგის კონფიგურაციაში აღვნიშნოთ, რომ ყველა რაუთზე ჩაიტვირთოს
ეს კომპონენტი:

```ts
export const routes: Routes = [
  { path: "first", component: FirstComponent },
  { path: "second", component: SecondComponent },
  { path: "", redirectTo: "first", pathMatch: "full" },
  { path: "**", component: NotFoundComponent },
];
```

`**` გულისხმობს ე.წ wildcard რაუთს. ანგულარის რაუთერი მასივში ზემოდან
ქვემოთ ჩამოუყვება მომხმარებლის მიერ გახსნილ რაუთს და შეამოწმებს თუ რომელი
ჩვენ მიერ განსაზღვრული `path` ემთხვევა მას. თუ არც ერთი `path` არ დაემთხვა,
უკანასკნელი ვარიანტი, რომელიც `**` არის მას გარანტირებულად დაიჭერს და
`NotFoundComponent`-ს გახსნის.

## Lazy Loading

ზოგჯერ რესურსების დასაზოგად საშუალება გვაქვს რომ კომპონენტის კოდი იქამდე არ
ჩავტვირთოთ ბრაუზერში, სანამ მომხმარებელი ამ კომპონენტისთვის საჭირო რაუთზე
არ გადაინაცვლებს, ანუ ჩვენ შეგვიძლია კომპონენტების "ზარმაცად ჩატვირთვა".
ამისთვის ვიყენებთ `loadComponent` თვისებას და ჯავასკრიპტის`import` ფუნქციით
ვაიმპორტებთ სათანადო მისამართიდან კომპონენტს, რომელსაც ფრომისის ფორმით ვაბრუნებთ.
`import` ფუნქცია შემოიტანს ნეიმსფეისს, სადაც კომპონენტის კლასი მისი ერთ-ერთი თვისებაა, ამიტომ
ამ კლასის გამოტანა მოგვიწევს `then` მეთოდით:

```ts
export const routes: Routes = [
  {
    path: "first",
    loadComponent: () =>
      import("./first/first.component").then((m) => m.FirstComponent),
  },
  {
    path: "second",
    loadComponent: () =>
      import("./second/second.component").then((m) => m.SecondComponent),
  },
  { path: "", redirectTo: "first", pathMatch: "full" },
  { path: "**", component: NotFoundComponent },
];
```

ასე კომპონენტები მხოლოდ კონკრეტული მისამართების მიხედვით დაიმპორტდებიან.

გასათვალისინებელია, თუ როგორ არის დაექსპორტებული კომპონენტის კლასი.
თუ ჩვენ კლასს დავაექსპორტებთ `default` ქივორდით:

```ts
export default class FirstComponent {}
```

მაშინ აღარ დაგვჭირდება `then` მეთოდი, რათა ნეიმსფეისიდან ამოვიღოთ კომპონენტის კლასი.
`import`-ის დაბრუნებული შედეგი პირდაპირ ჩვენთვის სასურველი კლასი იქნება:

```ts
loadComponent: () => import("./first/first-component");
```

## შეჯამება

ამ თავში ჩვენ ვისაუბრეთ მარტივ როუთინგზე. ანგულარში გვაქვს საშუალება, რომ მისამართის
ცვლილებებზე რეაგირება მოვახდინოთ და შევცვალოთ view, ანუ ის კომპონენტები გამოვსახოთ
ან გავაქროთ. ჩვენ როუთებს ვარეგისტრირებთ `Routes` ტიპის ცვლადში, სადაც ვუთითებთ,
რა მისამართზე რა კომპონენტი უნდა ჩაიტვირთოს. იმ კომპონენტში, სადაც გვინდა რომ view-ები
შეიცვალოს, ვათავსებთ `router-outlet` ელემენტს, სადაც ანგულარი მისამართის მიხედვით
განათავსებს სათანადო კომპონენტებს. ჩვენ ასევე საშუალება გვაქვს, რომ კომპონენტები
ზარაცად ჩავტვირთოდ მხოლოდ მაშინ, როცა ისინი მომხმარებელს სჭირდება, `loadComponent`
თვისების და `import` ფუნქციის დახმარებით.
