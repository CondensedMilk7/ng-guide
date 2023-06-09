# Pipeable Operators

ფაიფის ოპერატორებით ჩვენ საშუალება გვაქვს რომ არსებულ სტრიმს ბევრნაირად
გავუკეთოთ მოდიფიკაცია, ან სულაც ისე ჩავწვდეთ მის მნიშვნელობას, რომ სტრიმის
შედეგზე გავლენა არ ვიქონიოთ. ამ ოპერატორებს თანმიმდევრულად ვაწვდით სტრიმზე
დაძახებულ `pipe` მეთოდს:

```ts
someObservable = source.pipe(/* operators go here */);
```

### map

`map` ოპერატორის საშუალებით შეგვიძლია შევცვალოთ სტრიმის მიერ დაბრუნებული
მნიშვნელობები. მის ქოლბექში პარამეტრად ვიღებთ სტრიმის მიერ დაბრუნებულ შედეგს,
რომელზეც შეგვიძლია სასურველი ოპერაციების ჩატარება. აუცილებელია, რომ ამ ოპერატორმა
რაღაც დააბრუნოს.

მაგალითად თუ გვინდა, რომ შევქმნათ სტრიმი, რომელიც კონკრეტულად დოკუმენტში
მაუსის კოორდინატებს დააემითებს მაუსის მოძრაობაზე:

```ts
import { Component, OnDestroy, OnInit } from "@angular/core";
import { fromEvent, map } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  // Create an observable that emits mousemove events
  mouseMove$ = fromEvent<MouseEvent>(document, "mousemove");

  // Create a new observable that emits mouse coordinates,
  // based on mouseMove$ observable.
  mouseCoordinates$ = this.mouseMove$.pipe(
    map((event) => {
      if (event) {
        const coordinates = {
          x: event.pageX,
          y: event.pageY,
        };
        return coordinates;
      } else {
        return null;
      }
    })
  );

  ngOnInit(): void {
    // Subscribe and react to emissions of mouseCoordinates$
    this.mouseCoordinates$.subscribe((coordinates) => {
      if (coordinates) {
        console.log(coordinates.x, coordinates.y);
      }
    });
  }

  ngOnDestroy(): void {}
}
```

ჩვენ ჯერ მაუსის მოძრაობის სტრიმს ვქმნით და შემდგომ ცალკე სტრიმს, სადაც
პირველ სტრიმზე ვეძახით `pipe` ფუნქციას და მას ვაწვდით `map` ოპერატორს.
`map` ოპერატორით ვიღებთ ივენთის შესახებ ინფორმაციას (თუ ის არსებობს) და
მხოლოდ ივენთის კოორდინატებს ვაბრუნებთ. საპირისპირო შემთხვევაში ვაბრუნებთ
`null`-ს. სტრიმებმა პოტენციურად შეიძლება ეს მნიშვნელობა დააბრუნონ, თუ
დასაემითებელი არაფერი აქვთ.

ასე ჩვენ ცალკე სტრიმი შევქმენით, რომელიც მაუსის მოძრაობაზე გასცემს მაუსის
კოორდინატებს. მასზე ვასუბსქრაიბებთ და შედეგს კონსოლში ვლოგავთ.

დასუბსქრაიბების ალტერნატივა განვიხილოთ. ანგულარში არსებობს `async` ფაიფი.
ჩვენ თუ უბრალოდ სტრიმის მიერ დაბრუნებული მნიშვნელობის გამოსახვა გვინდა
თემფლეითში, იმის მაგივრად რომ კლასსში დავასუბსქრაიბოთ სტრიმს და
შემდეგ მისი მნიშვნელობა ამოვიღოთ ცალკე კლასის თვისებაში, შეგვიძლია პირდაპირ
ეგ სტრიმი გავიტანოთ თემფლეითში.

წავშალოთ სუბსქრაიბი და დავტოვოთ სტრიმი:

```ts
import { Component, OnDestroy, OnInit } from "@angular/core";
import { fromEvent, map } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  // Create an observable that emits mousemove events
  mouseMove$ = fromEvent<MouseEvent>(document, "mousemove");

  // Create a new observable that emits mouse coordinates,
  // based on mouseMove$ observable.
  mouseCoordinates$ = this.mouseMove$.pipe(
    map((event) => {
      if (event) {
        const coordinates = {
          x: event.pageX,
          y: event.pageY,
        };
        return coordinates;
      } else {
        return null;
      }
    })
  );

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
```

თემფლეითში გავატარპთ სტრიმი `async` ფაიფში და შემდგომ `json` ფაიფში,
რათა შედეგი დავაფორმატოთ.

```html
<h1>{{ mouseCoordinates$ | async | json }}</h1>
```

ასე ლავში გამოვსახავთ მაუსის კოორდინატებს ისე, რომ ჩვენით
სუბსქრაიბის დაწერა არ გვიწევს. პლიუსი ის არის, რომ `async` ფაიფი
ჩვენ მაგივრად გააკეთებს `unsubscribe`-ს კომპონენტის განადგურების დროს.

### tap

`tap` ოპერატორით შეგვიძლია სტრიმის კონკრეტულ მონაკვეთში შევიჭრათ,
ჩავწვდეთ მის ინფორმაციას და თვითონ სტრიმში არანაირი ცვლილება არ
შევიტანოთ. `tap`-ს ვიყენებთ ხოლმე გვერდითი მოვლენებისთვის.

ჩვენი წინა მაგალითის სტრიმს `map` ოპერატორის შემდეგ დავამატოთ `tap`.

```ts
import { Component, OnDestroy, OnInit } from "@angular/core";
import { fromEvent, map, tap } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  // Create a observable that emits mousemove events
  mouseMove$ = fromEvent<MouseEvent>(document, "mousemove");

  // Create an new observable that emits mouse coordinates,
  // based on mouseMove$ observable.
  mouseCoordinates$ = this.mouseMove$.pipe(
    map((event) => {
      if (event) {
        const coordinates = {
          x: event.pageX,
          y: event.pageY,
        };
        return coordinates;
      } else {
        return null;
      }
    }),
    tap((coordinates) => {
      console.log(coordinates);
    })
  );

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
```

როგორც ხედავთ, ჩვენ სტრიმს მოდიფიკაციას არ ვუკეთებთ,
თუმცა როცა ის მნიშვნელობას გასცემს, პარალელურად `tap`-ში
არსებული ლოგიკაც აქტიურდება. ეს შეიძლება პარალელურად http
მოთხოვნების გასაგზავნად ან მონაცემების მეხსიერებაში შესანახად დაგვჭირდეს.

ყურადრება მიაქციეთ, რომ რადგან ჩვენ `tap` დავწერეთ `map` ფუნქციის შემდეგ,
ჩვენ ვიღებთ `map`-ის მიერ მოდიფიცირებულ შედეგს. ჩვენ რომ ის `pipe`-ის თავში
დაგვეწერა, ქოლბექში მივიღებდით `MouseEvent` ტიპის ინფორმაციას. ანუ
ფაიფის ოპერატორები თანმიმდევრულად მუშაობენ.

### filter

`filter` ოპერატორო, როგორც ამაზე მისი სახელი მიგვანიშნებს, ფილტრავს
სტრიმს. იმის მიხედვით, ფილტრის დაბრუნებული მნიშვნელობა არის თუ არა
ჭეშმარიტისებრი, განისაზღვრება სტრიმში მნიშვნელობა ამ ფილტრის შემდეგ
გაიცემა თუ არა.

`mouseCoordinates$` სტრიმი გავფილტროთ და გავაცემინოთ მხოლოდ ის
მნიშვნელობები, სადაც კოორდინატები არსებობს და ამ კოორდინატებში `x`
მეტია 300-ზე.

```ts
import { Component, OnDestroy, OnInit } from "@angular/core";
import { filter, fromEvent, map, tap } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  // Create an observable that emits mousemove events
  mouseMove$ = fromEvent<MouseEvent>(document, "mousemove");

  // Create an new observable that emits mouse coordinates,
  // based on mouseEventSource observable.
  mouseCoordinates$ = this.mouseMove$.pipe(
    map((event) => {
      if (event) {
        const coordinates = {
          x: event.pageX,
          y: event.pageY,
        };
        return coordinates;
      } else {
        return null;
      }
    }),
    // only emit if these conditions are met
    filter((coordinates) => coordinates !== null && coordinates.x > 300),
    tap((coordinates) => {
      console.log(coordinates);
    })
  );

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
```

შედეგად სტრიმი მხოლოდ მაშინ გასცემს მნიშვნელობას როცა მაუსის კოორდინატები
აღემატება 300-ს.

### switchMap

`switchMap` ძალზედ სპეციფიკური ოპერატორია, რომლის საშუალებითაც შეგვიძლია
ერთი სტრიმიდან გადავეროთ მეორეზე. ვთქვათ გვაქვს სტრიმი, რომელიც რაუთის
პარამეტრებს გასცემს და ჩვენ ყოველ უახლეს გაცემულ პარამეტრზე გვინდა საპასუხოდ
HTTP მოთხოვნა გავაგზავნოთ, რომელიც ამ პარამეტრიდან მონაცემს გამოიყენებს.

იმავე პროექტში შევქმნათ products კომპონენტი. `AppModule`-ში დავამატოთ
რაუთები:

```ts
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { ProductsComponent } from "./products/products.component";
import { RouterModule, Routes } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

const routes: Routes = [{ path: "products/:id", component: ProductsComponent }];

@NgModule({
  declarations: [AppComponent, ProductsComponent],
  imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

ჩვენ პროდუქტების მისამართზე გვექნება `id` პარამეტრი. აქვე შემოგვაქვს
`HttpClientModule` და რა თქმა უნდა `RouterModule`-ში ვარეგისტრირებთ
ჩვენს რაუთებს.

`AppComponent`-ში მოვათავსოთ აუთლეტი:

```html
<h1>{{ mouseCoordinates$ | async | json }}</h1>
<router-outlet></router-outlet>
```

და მივხედოთ `ProductsComponent`-ს:

```ts
import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { switchMap } from "rxjs";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent {
  product$ = this.route.params.pipe(
    switchMap((params) => this.getProductById(params["id"]))
  );
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  getProductById(id: string) {
    return this.http.get<{ title: string; description: string; price: string }>(
      "https://dummyjson.com/products/" + id
    );
  }
}
```

კონსტრუქტორში შემოგვაქვს `HttpClient` და `ActivatedRoute`. აქვე ვქმნით
მეთოდს რომლითაც მოკლედ გავგზავნით GET მოთხოვნას ჩვენთვის უკვე ცნობილ
მისამართზე, სადაც ბოლოს საჭიროა `id`-ს მიწოდება, რომელსაც ფუნქციის
პარამეტრში მივიღებთ. მოთხოვნის დაბრუნებულ ტიპში მხოლოდ ამ სამ თვისებას,
სათაურს, აღწერასა და ფასს მივუთითებთ, რადგან დემონსტრაციისთვის ესეც
საკმარისია.

შემდეგ ჩვენ ვქმნით `product$` სტრიმს, სადაც ვიღებთ `route`-ის `params`
სტრიმს, და მასზე `pipe`-ში ვაწარმოებთ `switchMap` ოპერაციას. ვიღებთ
დაბრუნებულ პარამეტრებს და შედეგად ვაბრუნებთ http მოთხოვნას სადაც
ჩვენ პარამეტრებიდან აღებულ `id`-ს ვაწვდით. ასე ერთი სტრიმიდან
ვინაცვლებთ მეორეზე. ყოველი ახალი `params`-ის დაემითებულ მნიშვნელობაზე
ჩვენ ავიღებთ ამ მნიშვნელობას და გადავერთვებით ახალ სტრიმზე, რომელიც
პროდუქტის მიღების http მოთხოვნაა.
`map` ოპერატორისგან განსხვავებით, `switchMap`-ში საჭიროა, რომ დავაბრუნოთ
სტრიმი. ანუ ჩვენ არა უბრალოდ შედეგის მოდიფიკაციას ვაკეთებთ, არამედ მთლიანად
სტრიმის გადამისამართებას, ერთიდან მეორეზე.

თემფლეითში ახლა შეგვიძლია `async` ფაიფით მისი გამოსახვა:

```html
<div *ngIf="product$ | async as product">
  <h1>{{ product.title }}</h1>
  <p>{{ product.description }}</p>
  <p>{{ product.price }}</p>
</div>
```

ჩვენ `async` ფაიფი შეგვიძლია `ngIf` დირექტივშიც გამოვიყენოთ. შესაბამისად
ეს ბლოკი მაშინ გამოჩნდება, როცა სტრიმი შედეგს დააბრუნებს, ანუ როცა http
მოთხოვნაზე პასუხს მივიღებთ. `as product` არის ანგულარის მეთოდი, რომ
ამოვიღოთ სტრიმის დაბრუნებული მნიშვნელობა, როგორც ლოკალური ცვლადი
თემფლეითში. ამ ბლოკის შიგნით ამ ცვლადზე წვდომა გვაქვს, და შეგვიძლია
მისი თვისებები გამოვსახოთ.

შედეგად თუ გადავინაცვლებთ მისამართზე `localhost:4200/products/1` და
მოვიცდით, პროდუქტი უნდა გამოჩნდეს. `id`-ის შეცვლისას ყოველ ჯერზე
მიმდინარე მისამართზე `params` იცვლება, და შესაბამისად ჩვენი სტრიმის
იცვლება ახალ http მოთხოვნად, რომელიც `sync` ფაიფის წყალობით აქტიურდება
და გამოსახება აპლიკაციაში.

### შეჯამება

ამ თავში ჩვენ განვიხილეთ ფაიფის ოპერატორები, რომლებითაც შესაძლებელია
სტრიმების ბევრნაირად მოდიფიკაცია. ეს არის ყველაზე გამოყენებადი ოპერატორები,
რომლებიც დამწყები ანგულარ დეველოპერის ამოცანათა უმეტესობას ამოხსნის, თუმცა
ნუ შემოიფარგლებით მხოლოდ ამ ცოდნით. დაათვალიერეთ სხვა ოპერატორებიც
და გაეცანით გამოცდილი ანგულარ დეველოპერების ბლოგებს, სადაც მრავალ
პრაქტიკულ რჩევა-დარიგებებს ნახავთ.
