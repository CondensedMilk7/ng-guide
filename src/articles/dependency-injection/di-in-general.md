---
title: "DI ზოგადად"
---

# DI ზოგადად

ზოგადად პროგრამირებაში, DI არის დიზაინის პატერნი სადაც ობიექტი, კლასი თუ ფუნქცია
იღებს იმ ობიექტებსა და ფუნქციებს რომლებზეც ის დამოკიდებულია. ასე კოდის ორგანიზება
შეგვიძლია მათი მოვალეობების მიხედვით, სადაც კონკრეტული ფუნქცია, კლასი თუ ობიექტი
ერთ დანიშნულებას ემსახურება. თუ ეს დანიშნულება რაიმე სხვა კლასს სჭირდება, იგი მასზე
დამოკიდებულებას გამოაცხადებს.

სანიმუშოდ განვიხილოთ შემდეგი კლასები:

```ts
class Knight {
  defend() {
    return "defend the ruler";
  }
}
class General {
  command() {
    return "give commands";
  }
}
```

წარმოვიდგინოთ რომ ეს კლასები კონკრეტულ დანიშნულებას ასრულებენ დამოუკიდებლად.
ახლა ვთქვათ, რომ გვაქვს ერთი `Soldier` კლასი, რომელსაც სრულფასოვნად ფუნქციონირებისთვის
`General` კლასის ინსტანცია სჭირდება. `General` კლასის გამოყენების ერთი ვარიანტი
იქნებოდა ასეთი:

```ts
class Soldier {
  general: General;
  orders = "no orders for now";
  constructor() {
    this.general = new General();
    this.orders = this.general.command();
  }
}
```

ასეთ კოდში მკაფიოდ არ ჩანს, რომ `Soldier` კლასს სჭირდება `General`. ეს მიტუმეტეს გაუგებარი
იქნებოდა, თუ თითოეული კლასი ცალკეულ დიდ და კომპლექსურ ფაილში გვექნებოდა. როცა
ჩვენ `Soldier` კლასის ინსტანციას შევქმნიდით, არავის ეცოდინებოდა, რომ ამ კლასს სჭირდებოდა
`General` კლასი. მისი ინსტანცია შეიქმნება, მაგრამ ეს უკანა ფონზე, ჩუმად მოხდება.

```ts
const soldier1 = new Soldier();
const soldier2 = new Soldier();
const soldier3 = new Soldier();
```

აქ თითოეული `Soldier`-ის ინსტანციას ცალკეული `General`-ის ინსტანცია გააჩნია.
რაც უფრო მეტია `Soldier`, მით უფრო მეტი `General`-ს შექმნის ის.

ამიტომაც კონსოლში ეს დაგვიბრუნებს false-ს.

```ts
console.log(soldier1.general === soldier2.general);
```

ამის გასაკეთებლად უკეთესი და უფრო დეკლარაციული გზა იქნებოდა შემდეგნაირი:

```ts
class Soldier {
  orders = "no orders for now";
  constructor(public general: General) {
    this.orders = this.general.command();
  }
}
```

ჩვენ კონსტრუქტორში მივუთითებთ, რომ `Soldier` დამოკიდებულია General ტიპის ობიექტზე. `general`-ს ასევე კონსტრუქტორშივე დეკლარაციას ვუკეთებთ,
როგორც კლასის თვისებას `public` ან `private` სიტყვით. ასე არ გვჭირდება
კლასში ცალკე ჯერ თვისების შექმნა და შემდეგ მისი გატოლება კონსტრუქტორის
არგუმენტთან.
ახლა განსხვავება ის არის, რომ `Soldier` კლასის შექმნისას ჩვენ მას აუცილებლად უნდა
მივაწოდოთ `General`-ის ინსტანცია, იმის მაგივრად, რომ `Soldier`-მა ეს თავისით, ფარულად ქნას:

```ts
const general = new General();
const soldier1 = new Soldier(general);
const soldier2 = new Soldier(general);
const soldier3 = new Soldier(general);
```

ერთი მხრივ ახლა მკაფიოა, რომ `Soldier`-ს სჭირდება `General`, მაგრამ მეორე მხრივ,
ყოველ `Soldier`-ს ერთი და იგივე `General`-ის ინსტანცია აქვს. ასე ვთქვათ, ამ ჯარისკაცებს
ერთი გენერალი მართავს, რომლის ინსტანციაც ჩვენ თავდაპირველად შევქმენით, და თითოეულ
ჯარისკაცს მივაწოდეთ კონსტრუქტორში. ეს ასევე ბეფრად უფრო ეკონომიურია, რადგან ტყუილად
არ ვქმნითი იმდენივე `General`-ის ინსტანციას, რამდენი `Soldier`-იც დაგვჭირდება.

ახლა ეს შედეგად მოგვცემს true-ს

```ts
console.log(soldier1.general === soldier2.general);
```

ეს არის Dependency Injection-ის მარტივი მაგალითი. კლასი აცხადებს, თუ რაზეა ის დამოკიდებული,
ანუ აცხადებს თავის dependency-ს, რომელსაც შემდგომ ინსტანციის შექმნისას იღებს.

ახლა ასპარეზზე შემოვიყვანოთ მეფე: `King` კლასი, რომელიც საჭიროებს ყველა შემდეგ კლასს:
`Knight`, `Soldier`, `General`.

```ts
class King {
  constructor(
    public knight: Knight,
    public general: General,
    public soldier: Soldier
  ) {}
}
```

მაშინ ამ კლასის ინსტანციის შესაქმნელად ჩვენ შემდეგნაირად უნდა მოვიქცეთ:

```ts
const knight = new Knight();
const general = new General();
const soldier = new Soldier(general);
const king = new King(knight, general, soldier);
```

ჯერ დამოუკიდებელ `Knight` და `General` კლასებს ვქმნით, ხოლო შემდგომ
`Soldier` კლასს, რომელსაც `General`-ის ინსტანცია სჭირდება. შემდგომ ვქმნით
`King`-ის ინსტანციას, რომელსაც სამივე სჭირდება. აქ აღსანიშნავია, რომ `soldier`-სა
და `king`-ს ერთი და იგივე `General`-ის ინსტანცია გააჩნიათ: `general`.
ასე კლასების ურთიერთდამოკიდებულება უფრო მკაფიო და გასაგებია. დეკლარაციული
კოდის პლიუსი სწორედ ეს არის.

რაც უფრო მეტი კლასი გვიგროვდება, ამ dependency-ების მენეჯმენტი და ახალი კლასის ინსტანციების
შექმნა უფრო გართულდება. ანგულარში სწორედ ამიტომ არსებობს DI კონტეინერი, რომელიც ამ
ყველაფერს ჩვენ მაგივრად აგვარებს. ჩვენ კონსტრუქტორში უბრალოდ ის უნდა გამოვაცხადოთ, თუ რაზე
არის დამოკიდებული ჩვენი კლასი და დანარჩენს DI კონტეინერი მოაგვარებს.