---
title: "ვალიდატორის შექმნა"
---

# ვალიდატორის შექმნა

ვთქვათ არ გვინდა რომ სახელი რაიმე სიტყვას შეიცავდეს. შევქმნათ ამისთვის
ჩვენი ვალიდატორი.

კლასში შევქმნათ შემდეგი ფუნქცია:

```ts
  badNameValidator(pattern: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value.includes(pattern)
        ? { badName: 'This is a bad name!' }
        : null;
    };
  }
```

აქ `ValidatorFn` ტიპის ფუნქციას ვქმნით, რომლის პარამეტრიც იქნება ის პატერნი,
რომელსაც ჩვენ არგუმენტად მივაწვდით ვალიდაციის დამატებისას. ჩვენ ვაბრუნებთ
ანონიმურ ფუნქციას, რომელსაც ანგულარი კონფიგურაციას გაუკეთებს. მისი პარამეტრი
უნდა იყოს `AbstractControl` ტიპის. ეს სწორედ ის კონტროლი იქნება, რომელზეც
ჩვენ ამ ვალიდატორს დავაყენებთ. ასე ჩვენ ამ კონტროლზე გვაქვს წვდომა. ვალიდატორის
ფუნქცია უნდა აბრუნებდეს `ValidationErrors`, რომელიც პირობითი ობიექტია, ან `null`,
ამ უკანასკნელს იმ შემთხვევაში, თუ კონტროლი ვალიდურია.
თუ კონტროლის მნიშვნელობა ამ პატერნს შეიცავს, ჩვენ ვაბრუნებთ ობიექტს, სხვა შემთხვევაში
`null`-ს
ობიექტის სტრუქტურია პირობითია. ჯობია თუ თვისების სახელი
დაემთხვევა ფუნქციის სახელს, მინუს Validator. მისი მნიშვნელობა ის იქნება,
რაც მოგვესურვება. ამ შემთხვევაში ეს იყოს მესიჯი, რომელიც შეგვიძლია შემდგომ
თემფლეითში გამოვსახოთ.

დავამატოთ ეს ვალიდატორი კონტროლზე

```ts
signupForm = this.fb.group({
  name: [
    "",
    [
      Validators.required,
      Validators.pattern(/^[A-z]/),
      Validators.minLength(2),
      this.badNameValidator("badname"),
    ],
  ],
  email: ["", [Validators.required, Validators.email]],
  password: [
    "",
    Validators.required,
    this.matchingPasswordsValidator(this.confirmPassword),
  ],
});
```
