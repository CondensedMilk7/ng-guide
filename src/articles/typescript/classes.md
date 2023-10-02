---
title: "კლასები TypeScript-ში"
---

# კლასები TypeScript-ში

კლასების თვისებებზე ტიპიზირება ისევე მუშაობს, როგორც ობიექტის თვისებებზე:

```ts
class Point {
  x: number;
  y: number;
}

const pt = new Point();
pt.x = 0; // valid
pt.y = false; // error
```

მაგრამ გარდა ამისა, გვაქვს დამატებითი უსაფრთხოების ზომებიც.
თუ `tsconfig.json`-ში ჩვენ დავამატებთ ველს `"strict": true`,
მაშინ აუცილებელი გახდება რომ კლასის ველები იყოს ინიციალიზირებული
(ან დეკლარაციის დროს, ან კონსტრუქტორში).

```ts
class BadGreeter {
  name: string; // Error: Property 'name' has no initializer and is not definitely assigned in the constructor.
}
```

ამის გამოსასწორებლად უბრალოდ მისი ინიციალიზაციაა საჭირო:

```ts
class GoodGreeter {
  name: string;

  constructor() {
    this.name = "hello";
  }
}
```

ეს სიმკაცრე უზრუნველყოფს, რომ კლასში მნიშვნელობის გარეშე არც ერთი ველი არ
დარჩება.

## Readonly

ველების წინ `readonly`-ის დაწერით, ველის მნიშვნელობის შეცვლა
შესაძლებელი იქნება მხოლოდ კონსტრუქტორში, ანუ კლასის ინსტანციის
შექმნის დროს. ნებისმიერ სხვა შემთხვევაში ტაიპსკრიპტი ამის უფლებას არ
მოგვცემს:

```ts
class Hero {
  readonly name: string = "Tariel";

  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName;
    }
  }

  err() {
    this.name = "Avtandil"; // can't modify
  }
}

const g = new Hero();
g.name = "Pridon"; // can't modify here either
```

## public

ჩვეულებრივ ყველა კლასის წევრის ხილვადობა აირს დაყენებული `public`-ზე,
რაც ნიშნავს, რომ ის კლასის გარედან ხელმისაწვდომია,
მაგრამ ზოგჯერ კარგი აზრია რომ მისი ხილვადობა ექსპლიციტურად დავწეროთ:

```ts
class Greeter {
  public greet() {
    console.log("hi!");
  }
}
const g = new Greeter();
g.greet();
```

## protected

`protected` წევრები ხილვადია მხოლოდ იმ კლასების ქვეკლასებისთვის, რომლებშიც
ეს წევრებია დეკლარირებული:

```ts
class Greeter {
  public greet() {
    console.log("Hello, " + this.getName());
  }

  protected getName() {
    return "hi";
  }
}

class SpecialGreeter extends Greeter {
  public howdy() {
    // protected member visible here
    console.log("Howdy, " + this.getName());
  }
}

const g = new SpecialGreeter();
g.greet(); // visible public member
g.getName(); // protected member not visible here
```

## private

`private` ჰგავს `protected`-ს, მაგრამ იგი არ არის
ხილვადი ქვეკლასებისთვისაც კი, ანუ `private`
წევრისადმი წვდომა შესაძლებელია მხოლოდ კლასის
შიგნით.

```ts
class UnknownKnight {
  private name = "Tariel";
  public crying = true;

  introduce() {
    console.log(this.name); // visible
  }
}

const someone = new UnknownKnight();
console.log(someone.crying); // visible
console.log(someone.name); // error

class King extends UnknownKnight {
  showName() {
    console.log(this.name); // error
  }
}
```
