---
title: "Route Params"
---

# Route Params

რაუთის რაღაც ნაწილები ხშირად დინამიკურია. მაგალითად შეიძლება
მისამართი შეიცავდეს პროდუქტის აიდის, რომლის საფუძველზეც
აპლიკაციამ უნდა სათანადო პროდუქტის დეტალები გამოსახოს.
ამ მაგალითში სწორედ ასეთ სცენარს განვიხილავთ.

წინასწარ გვაქვს გამზადებული აპლიკაცია როუთინგით.
app.component.html-ში გვაქვს `router-outlet`.

`AppRoutingModule`-ში გვაქვს ასეთი კონფიგურაცია:

```ts
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductDetailsComponent } from "./product-details/product-details.component";
import { ProductsComponent } from "./products/products.component";

const routes: Routes = [
  { path: "products", component: ProductsComponent },
  { path: "products/:id", component: ProductDetailsComponent },
  { path: "", redirectTo: "products", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

ეს ორი გვერდი დანიშნულებით განსხვავდება. პირველი გვერდი შეიცავს
პროდუქტების სიას, ხოლო მეორე გვერდი ერთი კონკრეტული პროდუქტის
დეტალებს. თუ რომელ პროდუქტს გამოსახავს, განსაზღვრული იქნება
`id`-ის მიხედვით. მის `path` თვისებაში სწორედ ამიტომ გვიწერია
`:id` ეს მიუთითებს დინამიკურ პარამეტრზე. მაგალითად ჩვენ უნდა შევძლოთ
`products/123` გვერდზე გადასვლა და იქ იმ პროდუქტის ნახვა, რომლის
აიდიც არის `123`.

პროდუქტის მოდელი ასე გამოიყურება:

product.model.ts

```ts
export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}
```

პროდუქტს უნდა ჰქონდეს აიდი, სახელი, აღწერა, სურათი და ფასი.
ასეთი ტიპის პროდუქტების სია და მათი აიდის მიხედვით მოპოვების
ლოგიკა გვაქვს `products.service.ts`-ში:

```ts
import { Injectable } from "@angular/core";
import { Product } from "./product.model";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  private products: Product[] = [
    {
      id: 0,
      name: "Lenovo ThinkPad T14",
      price: 899,
      description:
        'Gen 2 14" FHD (Intel 4-Core i5-1135G7, 16GB RAM, 512GB SSD, UHD Graphics) IPS Business Laptop, Backlit, Fingerprint, 2 x Thunderbolt 4, Webcam, 3-Year Warranty, Windows 11 Pro ',
      image:
        "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T2/images/I/71ZkGdXho8L._AC_SL1500_.jpg",
    },
    {
      id: 1,
      name: "Dell XPS 13 9310",
      price: 1200,
      description:
        "Touchscreen Laptop - 13.4-inch UHD+ Display, Thin and Light, Intel Core i5-1135G7, 8GB LPDDR4x RAM, 512GB SSD, Intel Iris Xe, Killer Wi-Fi 6 with Dell Service, Win 11 Home - Silver ",
      image:
        "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T2/images/I/81fiaID-a+L._AC_SL1500_.jpg",
    },
    {
      id: 2,
      name: 'HP Envy 17.3"',
      price: 1246,
      description:
        "FHD Touchscreen Laptop, Intel Core i7-1165G7, 64GB RAM, 2TB SSD, Backlit Keyboard, Intel Iris Xe Graphics, Fingerprint Reader, Webcam, Windows 11 Pro, Silver, 32GB USB Card ",
      image:
        "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T2/images/I/51eDX+ID6mL._AC_SL1000_.jpg",
    },
  ];

  getAllProducts() {
    return this.products;
  }

  getProductById(id: number) {
    return this.products.find((product) => product.id === id);
  }
}
```

ჩვენ აქ ვინახავთ პროდუქტების მასივს, რომლებსაც აქვთ უნიკალური აიდი.
ჩვენ საშუალება გვაქვს რომ ყველა პროდუქტი ერთიანად ავიღოთ, ან
მხოლოდ ერთი პროდუქტი აიდის მიხედვით.

ამ სერვისს იყენებს ჩვენი ორი კომპონენტი.
ProductsComponent უბრალოდ იღებს ამ პროდუქტების მასივს და
თემფლეითში განათავსებს:

```ts
import { Component } from "@angular/core";
import { ProductsService } from "../products.service";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent {
  constructor(public productsService: ProductsService) {}
}
```

```html
<div class="container">
  <ul>
    <li
      class="product"
      *ngFor="let product of productsService.getAllProducts()"
    >
      <h3>{{ product.name }}</h3>
      <img [src]="product.image" [alt]="product.name" />
      <p>{{ product.price | currency }}</p>
      <a routerLink="/products/{{ product.id }}">Details</a>
    </li>
  </ul>
</div>
```

ჩვენ უბრალოდ `NgFor` დირექტივით განვათავსებთ სერვისიდან აღებულ
პროდუქტებს და ასევე მათთვის ვქმნით სანავიგაციო ლინკებს routerLink-ით.
თითოეული პროდუქტის ლინკს ექნება ექნება თავისი აიდი, path-ის იმ ადგილას,
სადაც როუთის კონფიგურაციაში `:id` გვიწერია.

პროდუქტის ლინკზე დაჭერა გადაგვიყვანს `products/:id` მისამართზე, მაგრამ
პროდუქტები ჯერ არ გამოჩნდება. როგორმე `ProductDetails` კომპონენტში
ჩვენ უნდა ჩავწვდეთ როუთის პარამეტრებს და ამის მიხედვით მოვიძიოთ
კონკრეტული პროდუქტი.

```ts
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { Product } from "../product.model";
import { ProductsService } from "../products.service";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"],
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const product = this.productsService.getProductById(+params["id"]);
      if (product) {
        this.product = product;
      }
    });
  }
}
```

ჩვენ პროდუქტს შევინახავთ `product` ცვლადში. ამ კომპონენტში შემოგვაქვს `NgOnInit`
lifecycle hook, ასე გვაქვს საშუალება, რომ `ngOnInit` მეთოდში ვაწარმოოთ ოპერაციები,
რომლებიც აპლიკაციის ინიციალიზაციის დროს უნდა მოხდეს. ჩვენ კონსტრუქტორში
ProductsService-ის გარდა ვაინჯექთებთ `ActivatedRoute`, სწორედ მისი დახმარებით
ვიღებთ ინფორმაციას აქტიურ როუთზე.

ჩვენ გვაინტერესებს `params` თვისება, რომელიც აბრუნებს observable-ს, შესაბამისად
ჩვენ უნდა დავასუბსქრაიბოთ მასზე. ქოლბექში ვიღებთ პარამეტრებს. ავიღოთ
პარამეტრებიდან `id` თვისება და მივაწოდოთ ის არგუმენტად `productService.getProductById`-ს.
`params`-ს წინ ვუწერთ `+`-ს, რადგან შედეგი ყოვეთვის სტრინგია, თუმცა ჩვენ `getProductById`
მეთოდში რიცხვი გვჭირდება, ასე მას რიცხვად გარდავქმნით. პროდუქტის არსებობის შემთხვევაში
ჩვენ მას კლასის თვისებაში ვინახავთ და თემფლეითში გამოვსახავთ:

```html
<div class="container">
  <a routerLink="/products">Back to products</a>
  <div *ngIf="product">
    <h1>{{ product.name }}</h1>
    <img [src]="product.image" [alt]="product.name" />
    <h3>{{ product.price | currency }}</h3>
    <p>{{ product.description }}</p>
  </div>
  <div *ngIf="!product">
    <h1>Error, product not found.</h1>
  </div>
</div>
```

ჩვენ პროდუქტს მაშინ ვაჩენთ, თუკი ის არსებობს, სხვა შემთხვევაში გამოვსახავთ
ერორის მესიჯს.

ასე აპლიკაცია ხელმძღვანელობს როუთის პარამეტრებით. აქვე რადგან კლასში
საბსქრიფშენს ვიყენებთ, ჯობია თუკი მას გავაუქმებთ, როცა კომპონენტი განადგურდება.
ამისთვის კლასში შემოგვაქვს `OnDestroy` ინტერფეისი და `ngOnDestroy` მეთოდი.
ეს უკანასკნელი აქტიურდება კომპონენტის განადგურებისას. ჩვენ შეგვიძლია შევქმნათ
`destroyed$` საბჯექთი, რომელსაც აპლიკაციის განადგურებისას დავანექსთებთ.
კლასში ყველა საბსქრიბშენი შეგვიძლია იქამდე ვამუშავოთ, სანამ ეს საბჯექთი
არ დაანექსთებს.

```ts
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { Product } from "../product.model";
import { ProductsService } from "../products.service";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product!: Product;
  destroyed$ = new Subject<void>();

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroyed$)).subscribe((params) => {
      const product = this.productsService.getProductById(+params["id"]);
      if (product) {
        this.product = product;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
```

სწორედ ამიტომ ვიყენებთ `route.params`-ზე ჯერ `pipe` მეთოდს, `subscribe`-მდე.
ამ მეთოდში ვატარებთ `takeUntil` ოპერატორს (რომელიც `rxjs`-იდან უნდა დავაიმპორტოთ)
და ამ ოპერატორში აქგუმენტად ვაწვდით `destroyed$` საბჯექთს. ამით ვეუბნებით ამ
საბსქრიბშენს, რომ იქამდე იმუშაოს, სანამ კომპონენტი არ განადგურდება.
როცა კლასში საბსქრიბშენები გვაქვს, ბევრი მათგანი კომპონენტის განადგურების შემდეგაც
შეიძლება მუშაობდეს და ეს გარანტიას გვაძლევს, რომ აპლიკაცია ზედმეტ რესურსებს არ
დახარჯავს. ჩვენ არ გვჭირდება პარამეტრებისთვის მოსმენა, როცა სხვა გვერდზე ვიმყოფებით.

## შეჯამება

ამ თავში ჩვენ ვისაუბრეთ როუთის მარტივ პარამეტრებზე. ჩვენ განვსაზღვრეთ როუთების
კონფიგურაციაში `path`, რომელსაც ჩვენთვის სასურველი პარამეტრი ექნება. შემდეგ
ამ პარამეტრის მნიშვნელობებს ჩავწვდით `ActivatedRoute`-ის დაინჯექთებით კომპნენტში
და მასში `params` თვისებაზე დასუბსქრაიბებით. პარამეტრებიდან ჩვენ ავიღედ `id` და
სათანადო პროდუქტი გამოვსახეთ თემფლეითში.
