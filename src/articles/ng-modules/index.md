---
title: "NgModule"
---

# NgModule

`NgModule` კონფიგურაციას უკეთებს ანგულარის აპლიკაციას და ეხმარება სხვადასხვა ბიბლიოთეკების ორგანიზებაში.

`NgModule` არის კლასი, რომელიც მონიშნულია `@NgModule` დეკორატორით. `@NgModule` იღებს ინფორმაციას ობიექტის ტიპად, რომელიც აღწერს
თუ როგორ უნდა დააკომპილიროს კომპონენტის თიმფლეითი და როგორ მოხდეს სხვადასხვა პროცესების გაშვება `runtime` დროს. მოდულში აღიწერება: კომპონენტები,
დირექტივები, და ფაიფები. ასევე `NgModule`-ში აღიწერება სერვისები და მისი პროვაიდერებიც, რაც [`DI`](./dependency-injection) გამოყენების საშუალებას გვაძლევს.

## მოდული

მოდულები კარგი გზა არის აპლიკაციის ორგანიზებისათვის. მოდულის კონფიგურია არის შემდეგნაირი:

```ts
@NgModule({
  declarations: [
    // კომპონენტები, დირექტივები, და ფაიფები
  ],
  imports: [
    // ბიბლიოთეკები და მოდულები
  ],
  providers: [
    // სერვისები და პროვაიდერები
  ],
  bootstrap: [
    /*
      კომპონენტი, რომელსაც ანგულარი მოათავსებს index.html-ში აპლიკაციის გაშვების დროს.
      იგივე კომპონენტი აუცილებელია, ეწეროს დეკლარაციის მასივშიც.
    */
  ],
})
export class AppModule {}
```

მოდული ასრულებს შემდეგ მოქმედებებს:

- აღწერს კომპონენტებს, დირექტივებს და ფაიფებს, რაც ეკუთვნის მოდულს.
- ასაჯაროვებს სხვადასხვა კომპონენტებს, დირექტივებს და ფაიფებს, იმისათვის, რომ სხვა კომპონენტმა გამოიყენონ ისინი.
- აიმპორტებს სხვა მოდულის ფუნქციონალს.
- უზრუნველყოფბს სერვისებს აპლიკაციისთვის, რაც უნდა გამოიყენოს კომპონენტმა.

17 ვერსიამდე ანგულარის CLI მოდულებზე დაფუძვნებულ აპლიკაციას ქმნიდა. აპლიკაციის ძირეული მოდული იყო `AppModule`.
17-ს ზემოთ არსებული CLI გამოყენებით, ავტომატურად აპლიკაცია იქმნება [standalone](./standalone)-ზე. თუ გვსურს მოდულზე დაფუძვნებული აპლიკაციის შექმნა მაშინ გამოვიყენოთ შემდგომი ბრძანება:

```sh
ng new app-name --standalone=false
```

## Custom მოდული

ძირეული მოდულის გარდა, ასევე შესაძლებელი არის ცალკე მოდულების შექმნა. ცალკე მოდულის საშუალებით შესაძლებელია სხვადასხვა feature-ები ავკინძოთ ერთ მოდულში, ხოლო
სადაც მოხდება მისი დაიმპორტება, იქ დაემატება მისი ფუნქციონალი. მაგალითისთვის ავაწყოთ მოდული, რომელშიც გამოყენებული იქნება მატერიალის კომპონენტები.

პირველ რიგში CLI გამოყენებით, დავაგენერიროთ მოდული:

```sh
ng g m material
```

დაგენერირებულ ფაილში, შევიტანოთ შემდგომი მოდიფიცირება (საჭიროა ანგულარ მატერიალის დაინსტალირება).

```ts
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

@NgModule({
  exports: [MatFormFieldModule, MatInputModule, MatButtonToggleModule],
  imports: [CommonModule],
})
export class MaterialModule {}
```

შეგვიძლია სხვა მოდულში, დავამატოთ ჩვენს მიერ შექმნილი `MaterialModule`, რაც საშუალებას მოგვცემს, გამოვიყენოთ მასში არსებული მატერიალის მოდულები, ესენია:
`MatFormFieldModule`, `MatInputModule`, `MatButtonToggleModule`.

გამოყენებისთვის დავამატოთ `AppModule`-ში.

```ts
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";

import { MaterialModule } from "./material/material.module";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MaterialModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## Lazy loading

ნაგულისხმევია, რომ როცა აპლიკაცია იტვირთება `NgModule`-ები პირდაპირ იტვირთება. მსგავსი ტიპის ჩატვირტა გულისხმობს, რომ როგორც კი აპლიკაცია ჩაირთვება ყველა მოდული ჩაიტვირთება,მნიშვნელობა არ აქვს ის საჭიროა თუ არა. დიდი აპლიკაციისთვის, რომელსაც გააჩნია ბევრი რაუთი (route), მსგავსად ჩატვირთვა ამძიმებს აპლიკაციას, ამიტომაც არის კარგი lazy loading-ის გამოყენება. lazy loading არის მიდგომა, რომელიც ტვირთვას იმ `NgModule`-ებს, რომელიც სჭირდება აპლიკაციას. მსგავსი მოქმედებებით, ვამცირებთ აპლიკაციის ზომას, რაც ამცირებს ჩატვირთვის დროს.

თუ გვსურს, რომ ჩავტვირთოთ ანგულარის მოდული `lazy loading`-ით, უნდა გამოვიყენოთ `loadChildren`, `component`-ის ნაცვლად.

მაგალითი თუ როგორ შეიცვლება როუტინგის ძირითადი ფაილი (`AppRoutingModule`):

```ts
const routes: Routes = [
  {
    path: "visual",
    loadChildren: () =>
      import("./visual/visual.module").then((m) => m.VisualModule),
  },
];
```

იმის დასადასტურებლად მუშაობს თუ არა `lazy loading`, შეგიძლიათ შეამოწმოთ `network tab` (inspect -> network) თუ რამდენი ფაილი იტვირთება კონკრეტული როუტის ჩატვირთვის დროს.
