---
title: "Attribute Directives"
---

# Attribute Directives

ატრიბუტის დირექტივებ HTML ელემენტსა და კომპონენტებს უცვლიან ქცევას, თვისებებსა და ატრიბუტებს.
ანგულარის ბევრ მოდულში (მაგ. `RouterModule`, `FormsModule`) არსებობს წინასწარ შექმნილი დირექტივები.
ამ თავში განვიხილავთ ატრიბუტის დირექტივებს: `NgClass`, და `NgModel`.

## NgClass

`NgClass`-ის საშუალებით ელემენტზე ერთდროულად რამდენიმე კლასის დამატება ან მოშორება შეგვიძლია.

`NgClass`-ის პრიმიტიული მაგალითი:

```html
<h1 [ngClass]="isSpecial ? 'special' : '' ">I love Angular</h1>
```

აქ ternary ლოგიკური ოპერაციით, იმის მიხედვით isSpecial არის თუ არა ჭეშმარიტი,
დავაბრუნებთ `special` სტრინგს ან ცარიელ სტრინგს, რომელიც `h1`-ს მიენიჭება.

შეგვიძლია `NgClass`-ს მივაწოდოთ ჯავასკრიპტის ობიექტიც, სადაც ობიექტის key
იქნება კლასის სახელი, ხოლო key-ს მნიშვნელობა იქნება ჭეშმარიტი ან მცდარი,
რაც იმას განსაზღვრავს, key-ში მითითებული კლასი ელემენტს უნდა მიენიჭოს თუ არა:

```html
<h1 [ngClass]="{special: isSpecial, interesting: isInteresting}">
  I love Angular
</h1>
```

აქ `isSpecial` და `isInteresting` ცვლადებია, რომლებიც კლასში უნდა არსებობდნენ.

## NgModel

`NgModel` დირექტივი არის `FormsModule`-ის ნაწილი, რომელიც ჩვენ საჭირო მოდულში
უნდა დავაიმპორტოთ. ამ შემთხვევაში მათ ვაიმპორტებთ `app.module.ts`-ში:

```ts
import { FormsModule } from "@angular/forms"; // <--- JavaScript import from Angular
/* . . . */
@NgModule({
  /* . . . */

  imports: [
    BrowserModule,
    FormsModule, // <--- import into the NgModule
  ],
  /* . . . */
})
export class AppModule {}
```

`NgModel` ფორმის ელემენტებზე გამოიყენება two way binding-ით.
დავუშვათ, რომ კომპონენტის კლასში გვაქვს ინიციალიზებული თვისება
title.

```html
<label for="example-ngModel">[(ngModel)]:</label>
<input [(ngModel)]="title" id="example-ngModel" />

<h1>You are learning {{ title }}</h1>
```

`NgModel` დირექტივს აქვს წვდომა `input` ელემენტში ჩაწერილ ტექსტზე.
ის ერთი მხრივ იმ ტექსტს განათავსებს ელემენტის ველში, რომელიც title
თვისების მნიშვნელობაა, და, მეორე მხრივ, title-ს იმ მნიშვნელობას
მისცემს, რაც `input` ველში ჩაიწერება.

## შეჯამება

ამ თავში ჩვენ განვიხილეთ `NgClass` და `NgModel` ატრიბუტ დირექტივები.
`NgClass` ელემენტს უცვლის კლასს გარკვეული პირობების მიხედვით, ხოლო
`NgModel` input ელემენტზე თავსდება two way binding-ით, რაც საშუალებას
გვაძლევს, რომ ფორმის ელემენტებს ინფორმაცია გადავცეთ და მათგან
ავიღოთ მომხმარებლის მიერ შეყვანილი ინფორმაცია.
