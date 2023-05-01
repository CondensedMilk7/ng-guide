# QueryParams

წინა ქვეთავში ჩვენ მარტივი პარამეტრები გამოვიყენეთ, მაგრამ ეს
განსხვავდება Query პარამეტრებისგან. მისი საშუალებით
შეგვიძლია აპლიკაციის სთეითი, იგივე მდგომარეობა შევინახოთ
მისამართში. ამ მაგალითში განვიხილავთ როგორ შეგვიძლია
პროდუქტების გაფილტვრის მეთოდი შევინახოთ QueryParams-ში.

ჩვენ ფაქტობრივად წინა ვიდეოს იდენტური აპლიკაცია გვაქვს, თუმცა
ყურადღებას მხოლოდ ერთ კომპონენტს მივაქცევთ: `ProductsComponent`
რომელიც იყენებს `ProductsService`-ს რათა პროდუქტები განათავსოს სთეითში.

სერვისში ინახება პროდუქტების მასივი, რომლებსაც გააჩნიათ აიდი, სახელი, აღწერა,
სურათი და ფასი. აქვე არსებობს მეთოდი ამ პროდუქტების მისაღებად.

როუთინგი კონფიგურირებული გვაქვს, რომ თავიდანვე `/products` გვერდზე გადავიდეთ
და გავხსნათ `ProductsComponent`. ეს კომპონენტი ასე გამოიყურება:

```ts
import { Component, OnInit } from "@angular/core";
import { Product } from "../product.model";
import { ProductsService } from "../products.service";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.products = this.productsService.getAllProducts();
  }
}
```

აპლიკაციის ინიციალიზაციის დროს ჩვენ პროდუქტების სიას ვიღებთ, და
კომპონენტში ვინახავთ.
ამ პროდუქტებს უბრალოდ თემფლეითში განვათავსებთ:

```ts
<div class="container">
  <ul>
    <li class="product" *ngFor="let product of products">
      <h3>{{ product.name }}</h3>
      <img [src]="product.image" [alt]="product.name" />
      <p>{{ product.price | currency }}</p>
      <a routerLink="/products/{{ product.id }}">Details</a>
    </li>
  </ul>
</div>

```

შევქმნათ ინფუთი, რომლის საშუალებითაც ავირჩევთ გაფილტვრის მეთოდს.
ამისთვის `FormsModule` დავაიმპორტოთ `AppModule`-ში:

```ts
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ProductsComponent } from "./products/products.component";
import { ProductDetailsComponent } from "./product-details/product-details.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [AppComponent, ProductsComponent, ProductDetailsComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

`ProductsComponent`-ში დავამატოთ შემდეგი თვისებები :

```ts
  sortBy: 'cheapest' | 'expensive' = 'cheapest';
  sortOptions = ['cheapest', 'expensive'];
```

ეს იქნება სორტირების მეთოდები: ჯერ იაფი პროდუქტები გამოჩნდეს
თუ ძვირი. თავდაპირველად სორტირება `cheapest`-ზე იქნება.
ასევე გვინდა სორტირების ვარიანტების მასივი, რომლითაც
ფორმას ავაგებთ.

ახლა უბრალოდ შევქმნათ `select` ელემენტი `NgModel` დირექტივით,
რომელსაც დავაკავშირებთ `sortBy` თვისებასთან. `NgFor` დირექტივით
სორტირების ვარიანტები განვათავსოთ და მათი მნიშვნელობები მივაბათ
ელემენტს. ასევე ის ინტერპოლაციით გამოვსახოთ. დაკლიკებაზე უნდა
გააქტიურდეს მეთოდი, რომლითაც სორტირება მოხდება.

```html
<div class="container">
  <label for="sort-select">Sort by</label>
  <select id="sort-select" [(ngModel)]="sortBy">
    <option
      *ngFor="let sortOption of sortOptions"
      [value]="sortOption"
      (click)="changeSort()"
    >
      {{ sortOption }}
    </option>
  </select>
  <ul>
    <li class="product" *ngFor="let product of products">
      <h3>{{ product.name }}</h3>
      <img [src]="product.image" [alt]="product.name" />
      <p>{{ product.price | currency }}</p>
      <a routerLink="/products/{{ product.id }}">Details</a>
    </li>
  </ul>
</div>
```

შევქმნათ `changeSort` მეთოდი. ჩვენ არსებულ სიას ასე პირდაპირ არაფერს
გავუკეთებთ. ჯერ უნდა მოხდეს ნავიგაცია, რომლის საფუძველზეც შეიცვლება
მისამართში query პარამეტრები და ჩვენ შემდგომ მასზე უნდა ვირეაგიროთ.

```ts
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Product } from "../product.model";
import { ProductsService } from "../products.service";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent implements OnInit {
  sortBy: "cheapest" | "expensive" = "cheapest";
  sortOptions = ["cheapest", "expensive"];
  products: Product[] = [];

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      const unsortedProducts = this.productsService.getAllProducts();
      const sortBy = queryParams["sortBy"];
      this.sortBy = sortBy;
      this.products = this.sortProducts(unsortedProducts, sortBy);
    });
  }

  sortProducts(products: Product[], sortBy: "cheapest" | "expensive") {
    console.log("sorting!");
    if (sortBy === "cheapest") {
      return products.sort((a, b) => a.price - b.price);
    } else {
      return products.sort((a, b) => b.price - a.price);
    }
  }

  changeSort() {
    this.router.navigate(["products"], {
      queryParams: { sortBy: this.sortBy },
    });
  }
}
```

`changeSort` მეთოდი იყენებს კომპონენტში დაინჯექტებული `Router`-ის
ინსტანციას და მასზე უძახებს `navigate` მეთოდს. ეს არის `routerLink`-ის
მსგავსი ხელსაწყო, ოღონდ კლასში. პირველ არგუმენტად ეს მეთოდი იღებს
მისამართის ცალკეული ერთეულების მასივს. ჩვენ იმავე გვერდზე, `prodocts`-ზე
გვინდა ნავიგაცია, უბრალოდ უნდა შევცვალოთ პარამეტრები. მეორე არგუმენტად
ფუნქცია იღებს კონფიგურაციის ობიექტს. აქ ერთ-ერთი თვისებაა `queryParams` სადაც
შეგვიძლია პარამეტრების ობიექტის შექმნა, რომელსაც ანგულარი გარდასახავს
პარამეტრებში მისამართის სტრინგად.

აქ ჩენ შევქმენით `sortBy` პარამეტრი, რომლის მნიშვნელობაც იქნება მომხმარებლის
მიერ არჩეული სორტირების მეთოდი. მისამართში ეს გამოჩნდება, როგორც
`/products?sortBy=cheap`.

შემდეგ ჩვენ გვინდა ამ რაუთის ცვლილებაზე რეაგირება. სწორედ ამიტომ NgOnInit-ში
ვიყენებთ დაინჯექთებულ `ActivatedRoute`-ს, რათა დავასუბსქრაიბოთ მასში არსებულ
`queryParams`-ზე. ჩვენ პროდუქტების სიას ვინახავთ ლოკალურ ცვლადში და ასევე
`queryParams`-იდან ვიღებთ ქოლბექში ხელმისაწვდომ პარამეტრების ობიექტს.
აქ ჩვენი შექმნილი პარამეტრის მნიშვნელობა შეგვიძლია ავიღოთ - `sortBy`.
ჩვენ ამ სორტირების ვარიანტს კლასის თვისებაში ვანახლებთ, რათა
გვერდის დარეფრეშებაზე ფორმაში ისევ სწორი ვარიანტი იყოს არჩეული.
რაც მთავარია, ახლა სორტირების მეთოდის მიხედვით ვასორტირებთ
პროდუქტებს და მათ კლასის თვისებაში ვინახავთ.
სორტირებას ვაკეთებთ `sortProducts` ფუნქციით. აქ პროდუქტებს და სორტირების
მეთოდს ვიღებთ და ამის მიხედვით სათანადოდ სორტირებულ პროდუქტებს ვაბრუნებთ.

ყოველ ნავიგაციაზე `queryParams`-ის საბსქრიფშენშში არსებული მეთოდი
აქტიურდება და ანახლებს:

- მიმდინარე სორტირების მეთოდს: `this.sortBy`,
- პროდუქტების მასივს ამ სორტირების მიხედვით: `this.products`.

შედეგად შეგვიძლია პროდქტების სორტირება `queryParams`-ით.
რა თქმა უნდა შესაძლებელია იმდენი `queryParams`-ის შექმნა,
რამდენიც მოგვესურვება.

## შეჯამება

ამ თავში ჩვენ ვისწავლეთ კლასში `Router`-ის გამოყენება
`queryParams`-ით და `ActivatedRoute`-ზე `queryParams`-ის
ცვლილებებზე რეაგირება. ჩვენ მომხმარებლის მიერ სორტირების მეთოდის
შეცვლის საფუძველზე ვახორციელებთ ნავიგაციას განახლებული `queryParams`-ით.
`queryParams`-ის ცვლილებას ამავე კომპონენტში ვუსმენთ და სათანადოდ
ვრეაგირებთ: ვანახლებთ სორტირების მეთოდს და ვასორტირებთ პროდუქტების სიას.
