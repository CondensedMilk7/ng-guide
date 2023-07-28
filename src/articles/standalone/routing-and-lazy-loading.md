---
title: "Routing"
---

# Routing

Standalone სისტემაში შემოტანილია რაუთერის გამარტივებული API.
ახლა შესაძლებელია რაიმე რაუთების შექმნა ცალკე ფაილში:

```ts
export const ROUTES: Route[] = [
  { path: "admin", component: AdminPanelComponent },
  // ... other routes
];
```

და მისი დამატება main.ts-ში `bootstrapApplication`-ის კონფიგურაციაში, კერძოდ
providers მასივში `provideRouter` ფუნქციის დახმარებით:

```ts
import { ROUTES } from "./app/admin/admin.routes.ts";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([ROUTES]),
    // ...
  ],
});
```

## Lazy-loading

შესაძლებელია რაუთების "ზარმაცად" ჩატვირთვაც. ამისთვის გამოიყენება `loadComponent`:

```ts
export const ROUTES: Route[] = [
  {
    path: "admin",
    loadComponent: () =>
      import("./admin/panel.component").then((mod) => mod.AdminPanelComponent),
  },
  // ...
];
```

თუ რამდენიმე რაუთის "ზარმაცად" ჩატვირთვა გვინდა, შეგვიძლია ცალკე რაუთების
ფაილის დაიმპორტება `loadChildren`-ით:

```ts
// In the main application:
export const ROUTES: Route[] = [
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/routes").then((mod) => mod.ADMIN_ROUTES),
  },
  // ...
];

// In admin/routes.ts:
export const ADMIN_ROUTES: Route[] = [
  { path: "home", component: AdminHomeComponent },
  { path: "users", component: AdminUsersComponent },
  // ...
];
```

ეს მეთოდი მხოლოდ მაშინ მუშაობს, როცა ყველა ჩატვირთული კომპონენტი არის standalone.

## რაუთების ჯგუფისთვის სერვისის მიწოდება

თუ არსებობს სერვისი, რომელიც გვინდა რომ მხოლოდ `/admin`-ის ფარგლებში
ფუნქციონირებდეს, ეს შეგვიძლია რაუთების სიაშივე გავაკეთოთ, `providers` თვისებით:

```ts
export const ROUTES: Route[] = [
  {
    path: "admin",
    providers: [AdminService, { provide: ADMIN_API_KEY, useValue: "12345" }],
    children: [
      { path: "users", component: AdminUsersComponent },
      { path: "teams", component: AdminTeamsComponent },
    ],
  },
  // ... other application routes that don't
  //     have access to ADMIN_API_KEY or AdminService.
];
```

აქ `admin` რაუთსა და მის შვილებს (`children`-ში არსებულ რაუთებს) წვდომა აქვთ
`AdminService`-სა და `ADMIN_API_KEY`-ზე.
