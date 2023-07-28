---
title: "შექმნა და გამოყენება"
---

# შექმნა და გამოყენება

კომპონენტების (ისევე, როგორც დირექტივებისა და ფაიფების) შექმნა შეიძლება მათი შემქმნელი
დეკორატორის კონფიგურაციის ობიექტში `standalone` თვისების`true`-ზე დაყენებით:

```ts
@Component({
  standalone: true,
  selector: "image-grid",
  imports: [ImageGridComponent],
  templateUrl: "./image-grid.component.ts",
})
export class ImageGridComponent {
  // component logic
}
```

თუ ამ კომპონენტის სადმე გამოყენება დაგვჭირდება, მას არ ვარეგისტრირებთ `NgModule`-ში,
არამედ პირდაპირ ვაიმპორტებთ იმ დამოუკიდებელ კომპონენტში, რომელშიც ის დაგვჭირდება:

```ts
@Component({
  standalone: true,
  selector: "photo-gallery",
  imports: [ImageGridComponent],
  template: ` ... <image-grid [images]="imageList"></image-grid> `,
})
export class PhotoGalleryComponent {
  // component logic
}
```

`imports` ველში ასევე შეიძლება დამოუკიდებელი ფაიფებისა და დირექტივების შემოტანაც.

## NgModule-ების შემოტანა დამოუკიდებელ კომპონენტებში

თუ ჩვენ აპლიკაციაში გვჭირდება ფუნქციონალი, რომლებიც არ არიან standalone და
მოდულებში არიან შეკრული, მაშინ შეგვიძლია ამ მოდულების კომპონენტში პირდაპირ
შემოტანა `imports` მასივში:

```ts
@Component({
  standalone: true,
  selector: "photo-gallery",
  // an existing module is imported directly into a standalone component
  imports: [MatButtonModule],
  template: `
    ...
    <button mat-button>Next Page</button>
  `,
})
export class PhotoGalleryComponent {
  // logic
}
```

ასე `MatButtonModule`-ში არსებული ყველა დაექსპორტებული კომპონენტი, ფაიფი თუ დირექტივი
ხელმისაწვდომია `PhotoGalleryComponent`-ში.

## დამოუკიდებელი კომპონენტის შეტანა NgModule-ში

ანალოგიურად, შესაძლებელია დამოუკიდებელი კომპონენტების შეტანა NgModule-ზე დაფუძნებულ
კონტექსტშიც. ეს უზრუნველყოფს შესაძლებლობას, რომ ძველი აპლიკაციები ეტაპობრივად და
მარტივად გადავიყვანოთ NgModule სისტემიდან standalone სისტემაზე.

```ts
@NgModule({
  declarations: [AlbumComponent],
  exports: [AlbumComponent],
  imports: [PhotoGalleryComponent],
})
export class AlbumModule {}
```

თუმცა `PhotoGalleryComponent` არის standalone, მისი დაიმპორტება ძველებური მეთოდითაც
შეიძლება.

ასერომ, დამოუკიდებელი კომპონენტები არ მოდიან კონფლიქტში ანგულარის წინა ვერსიის
მოდულებთან. რაღაც თვალსაზრისით, ახლა თითოეული კომპონენტი არის თვითკმარი მოდული.

## Bootstrapping

ასეთი სისტემით `main.ts`-ში bootstrap განსხვავებულად ხდება. იმის მაგივრად, რომ ეს
მოხდეს მთლიან მოდულზე, გამოიყენება ფუნქცია `bootstrapApplication` რომელიც აპლიკაციის
მთავარ დამოუკიდებელ კომპონენტს იღებს:

```ts
import { bootstrapApplication } from "@angular/platform-browser";
import { PhotoAppComponent } from "./app/photo.app.component";

bootstrapApplication(PhotoAppComponent);
```

მეორე არგუმენტად ობიექტში, providers მასივში შესაძლებელია ისეთი მოდულების შემოტანა
რომლებიც (ძველი მიდგომით) `forRoot` ფუნქციაზე დაძახებას საჭიროებენ:

```ts
import { LibraryModule } from "ngmodule-based-library";

bootstrapApplication(PhotoAppComponent, {
  providers: [importProvidersFrom(LibraryModule.forRoot())],
});
```

აქვე შეიძლება DI-ს კონფიგურაციაც:

```ts
bootstrapApplication(PhotoAppComponent, {
  providers: [
    {
      provide: BACKEND_URL,
      useValue: "https://photoapp.looknongmodules.com/api",
    },
    // ...
  ],
});
```
