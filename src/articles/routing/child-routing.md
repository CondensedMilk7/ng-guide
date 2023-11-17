---
title: "Child Routing"
---

# Child Routing

მისამართის ცვლილება არ ხდება მხოლოდ ზედა დონეზე. არის შემთხვევები, როცა
გვინდა კონკრეტული მისამართის შიგნით ნავიგაცია. აქ, წინასწარ გამზადებულ
აპლიკაციაში გვაქვს ორი კომპონენტი: `FirstComponent` `LastComponent` და
ისინი სათანადო მისამართებზე იტვირთება, როგორც ეს როუთინგის კონფიგურაციაშია:

app.routes.ts-ში:

```ts
import { Routes } from "@angular/router";
import { FirstComponent } from "./first/first.component";
import { SecondComponent } from "./second/second.component";

export const routes: Routes = [
  { path: "first", component: FirstComponent },
  { path: "second", component: SecondComponent },
  { path: "", redirectTo: "first", pathMatch: "full" },
];
```

`router-outlet` გვაქვს განთავსებული `AppComponent`-ში.
აქვე გვაქვს ჰედერი, საიდანაც ვაკეთებთ ნავიგაციას:

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

> **შენიშვნა:** არ დაგავიწყდეთ კომპონენტში `RouterModule`-ის შემოტანა.

ახლა ვთქვათ გვინდა, რომ Second კომპონენტის შიგნით შევძლოთ კიდევ სხვადასხვა კომპონენტზე
ნავიგაცია. შევქმნათ ორი კომპონენტი `SecondComponent`-ის შიგნით.

```sh
ng g c second/child-one
```

```sh
ng g c second/child-two
```

ამ კომპონენტებს უკვე აქვთ თემფლეითში მარკაპი, რომ შედეგი დავინახოთ.
ახლა კონფიგურაციას მივხედოთ `app.routes.ts`-ში:

```ts
import { Routes } from "@angular/router";
import { FirstComponent } from "./first/first.component";
import { ChildOneComponent } from "./second/child-one/child-one.component";
import { ChildTwoComponent } from "./second/child-two/child-two.component";
import { SecondComponent } from "./second/second.component";

export const routes: Routes = [
  { path: "first", component: FirstComponent },
  {
    path: "second",
    component: SecondComponent,
    children: [
      { path: "child-one", component: ChildOneComponent },
      { path: "child-two", component: ChildTwoComponent },
    ],
  },
  { path: "", redirectTo: "first", pathMatch: "full" },
];
```

იმ როუთისთვის, რომლის შიგნითაც გვინდა დამატებითო როუთების შექმნა,
ვწერთ თვისება `childern`-ს სადაც გვექნება იგივე როუთის ობიექტების მასივი.
აქ უკვე ჩვენ ახალ შექმნილ კომპონენტებს მივუთითებთ.
დააკვირდით, რომ აქ პირდაპირ `second` როუთის შემდეგ რა მისამართი უნდა მოვიდეს
იმას ვწერთმ და არა პირდაპირ `second/child-one`-ს, თუმცა ბრაუზერის მისამართში
ეს სწორედ ასე იქნება.

ახლა `SecondComponent`-ში შევქმნათ ნავიგაციის ლინკები და, რა თქმა უნდა,
`router-outlet`.

```html
<p>second works!</p>
<nav>
  <ul>
    <li><a routerLink="child-one">Child One</a></li>
    <li><a routerLink="child-two">Child Two</a></li>
  </ul>
</nav>
<router-outlet></router-outlet>
```

დააკვირდით, რომ ახლა ვიყენებთ ფარდობით მისამართებს, ისინი
არ იწყებიან `/`-ით. ეს ნიშნავს, რომ მიმდინარე მისამართის შიგნით
მოხდება ნავიგაცია `routerLink`-ში ნაწილზე. ანუ შედეგად გვექნება
`second/child-one` და `second/child-two`. თუ მას წინ
დახრილ ხაზს დავუწერდით, ეს იქნებოდა გლობალური მისამართი, ანუ
`localhost:4200/child-one`, რომელიც ჩვენ პროექტში არ არსებობს.

ახლა `second` მისამართის შიგნით child routing უნდა მუშაობდეს.

## რამდენიმე რაუთის ერთდროულად ზარმაცად ჩატვირთვა

ჩვენ შეგვიძლია მთლიანი რაუთების კონფიგურაცია ჩავტვირთოთ ზარმაცად.
წარმოვიდგინოთ რომ პროექტში გვაქვს ფოლდერი `admin` სადაც ინახება
ადმინისტრატორის გვერდის კომპონენტები. ესენია:
`admin-home.component.ts`, სადაც ადმინისტრატორის მთავარი გვერდია
(`/admin/home`) და `admin-users.component.ts`, სადაც ადმინისტრატორი
მომხმარებლებს მართავს (`/admin/users`). ამავე ფოლდერში შეიძლება
გვქონდეს რაუთების კონფიგურაცია:

```ts
// admin/admin.routes.ts

export const ADMIN_ROUTES: Route[] = [
  { path: "home", component: AdminHomeComponent },
  { path: "users", component: AdminUsersComponent },
  // ...
];
```

მაშინ შეგვიძლია მთავარი რაუთების კონფიგურაციის ობიექტში
(`app.routes.ts`-ში) ის შემოვიტანოთ `loadChildren` თვისების
ქვეშ:

```ts
// app.routes.ts
export const routes: Route[] = [
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/routes").then((mod) => mod.ADMIN_ROUTES),
  },
  // ...
];
```

<!-- TODO: ცალკე NgModule-ის თავში გადავიტანო -->
<!-- ## Lazy Loading (მოდულებით)

ზოგჯერ შეიძლება დაგვჭირდეს თვითონ პროექტის ცალკეული გვერდების მოდულებად
ორგანიზება, სადაც ამ კომპონენტებს თავიანთი routing მოდული ექნებათ.
ვთქვათ `SecondComponent` იმდენად გაიზარდა, რომ მას ცალკე უნდა მენეჯმენტი,
როგორც მთლიან მოდულს. აქ ასევე შეგვიძლია ამ მთლიანი მოდულის მხოლოდ
მაშინ ჩატვირთვა, როცა მომხმარებელი ამ მოდულისთვის საჭირო გვერდზე იქნება.

ჩვენ second ფოლერში ვქმნით `second.module.ts` `second-routing.module.ts`-ს.

second-routing.module.ts:

```ts
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChildOneComponent } from "./child-one/child-one.component";
import { SecondComponent } from "./second.component";
import { ChildTwoComponent } from "./child-two/child-two.component";

const routes: Routes = [
  {
    path: "",
    component: SecondComponent,
    children: [
      { path: "child-one", component: ChildOneComponent },
      { path: "child-two", component: ChildTwoComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecondRoutingModule {}
```

რადგან ჩვენთვის `second` იქნება ახალი მოდული, მისი მთავარი გვერდი
უნდა იტოს `SecondComponent` და მათი შვილები იქნებიან ჩვენი შექმნილი
ორი კომპონენტი.

ახლა `RouterModule`-ზე ვიყენებთ `forChild` მეთოდს, რადგან ეს
იქნება მთავარი მოდულის, `AppRoutingModule`-ის შვილი, ანუ
აქ შექმნილი როუთები მოექცება მთავარი როუთების შიგნით.

second.module.ts

```ts
import { NgModule } from "@angular/core";
import { ChildOneComponent } from "./child-one/child-one.component";
import { ChildTwoComponent } from "./child-two/child-two.component";
import { SecondRoutingModule } from "./second-routing.module";
import { SecondComponent } from "./second.component";

@NgModule({
  declarations: [SecondComponent, ChildOneComponent, ChildTwoComponent],
  imports: [SecondRoutingModule],
})
export class SecondModule {}
```

ახლა `SecondModule`-ში არსებულ მოდულს, კომპონენტსა თუ სერვისს, ანუ
ყველაფერს რაც მხოლოდ ამ მოდულში დაგვჭირდება, დეკლარაციას ვუკეტებთ
აქ. აქვე ვაიმპორტებთ `SecondRoutingModule`-ს.

ახლა `app.module.ts`-ში უნდა მოვაშოროთ იმ კომპონენტების დეკლარაცია,
რომელიც `SecondModule`-ში გვაქვს, რათა ანგულარმა ისინი არ შექმნას
თავიდანვე.

```ts
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FirstComponent } from "./first/first.component";

@NgModule({
  declarations: [AppComponent, FirstComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

აქ არ დავაიმპორტებთ SecondModule-ს. ის `AppRoutingModule`-ს
უნდა შემოვატანინოთ, მხოლოდ მაშინ, როცა საჭირო როუთზე მოვხვდებით.

```ts
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FirstComponent } from "./first/first.component";

const routes: Routes = [
  { path: "first", component: FirstComponent },
  {
    path: "second",
    loadChildren: () =>
      import("./second/second.module").then((m) => m.SecondModule),
  },
  { path: "", redirectTo: "first", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

აქ ყველაფერი იგივე რჩება, გარდა იმ როუთისა, რაც `second`-ს ეხება.
ჩვენ ვიყენებთ თვისება `loadChildren`-ს სადაც ქოლბექში ვაბრუნებთ
დაძახებულ `import` ფუნქციას, სადაც ვაწვდით ჩვენი `SecondModule`-ის
მისამართს. ეს ასინქრონული ოპერაციაა, მასზე სწორედ ამიტომ ვეძახით
მასზე then მეთოდს, სადაც გვიბრუნდება დაიმპორტებული ფაილი. ამ
ფაილიდან ჩვენ ვაბრუნებთ `SecondModule`-ს. ანუ `second` path-ზე
ჩვენ მთლიან `SecondModule`-ს ვაიმპორტებთ. დანარჩენი, იქნება ეს
კომპონენტები, სერვისების დეკლარაცია თუ რაუთინგი უშუალოდ ამ
მოდულმა უნდა მოაგვაროს.

ჩვენ უკვე ეს ყველაფერი მოვაგვარეთ `SecondModule`-სა და `SecondRoutingModule`-ში.
შესაბამისად ყველაფერი მუშაობს. განსხვავება ის არის, რომ ახლა ეს მოდული
მხოლოდ მაშინ იტვირთება, როცა ჩვენ `second` მისამართზე გადავალთ.

### შეჯამება

ამ თავში ჩვენ განვიხილეთ child routing, ანუ ცალკეული როუთის შიგნით როგორ
მოხდეს როუთინგი. ამისთვის დაგვჭირდა `children` თვისების გამოყენება, სადაც
დამატებითი როუთების კონფიგურაციას ვწერთ. შემდგომ ჩვენ განვიხილეთ როგორ
დავაიმპორტოთ მთლიანი ცალკეული მოდულები lazy loading-ით. ასე მოდული
იტვირთება მაშინ, როცა მისი საჭიროება იქმნება. ასე ჩვენ რესურსებს ვზოგავთ. -->
