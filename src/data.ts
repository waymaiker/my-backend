import { Subscription, Language } from "./dtos/shared/types";

export interface Data {
  chapters: {
    id: number,
    name: string,
    max_level: number,
    exercises: number[],
    created_at: Date,
    updated_at: Date,
    scope: Subscription
  }[],
  users: {
    id: string,
    pseudo: string,
    phone: string;
    email: string;
    password: string;
    profile_language: Language,
    finished_level: number,
    created_at: Date,
    updated_at: Date,
    scope: Subscription
  }[]
}

export const data:Data = {
  chapters: [{
    id: 0,
    name: 'introduction',
    max_level: 4,
    exercises: [1,2,5,6],
    scope: Subscription.FREEMIUM,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 1,
    name: "greetings",
    max_level: 5,
    exercises: [11,12,75,76],
    scope: Subscription.FREEMIUM,
    created_at: new Date(),
    updated_at: new Date(),
  }],
  users: [{
    id: "834e0b68-6926-4329-b346-3e6e61613b94",
    pseudo: 'PREMIUM',
    phone: '',
    email: '',
    password: '',
    profile_language: Language.ENGLISH,
    finished_level: 1,
    created_at: new Date(),
    updated_at: new Date(),
    scope: Subscription.PREMIUM
  },
  {
    id: "575e7b94-ebf4-4e30-9478-969c85e9baf9",
    pseudo: 'PREMIUM',
    phone: '',
    email: '',
    password: '',
    profile_language: Language.ENGLISH,
    finished_level: 4,
    created_at: new Date(),
    updated_at: new Date(),
    scope: Subscription.PREMIUM
  },
  {
    id: "4c609110-0c6d-4217-aad9-792d506b686f",
    pseudo: 'FREEMIUM',
    phone: '',
    email: '',
    password: '',
    profile_language: Language.ENGLISH,
    finished_level: 54,
    created_at: new Date(),
    updated_at: new Date(),
    scope: Subscription.FREEMIUM
  },
  {
    id: "2477c3be-f9fe-4b2d-8784-8fa5cae3b8ec",
    pseudo: 'FREEMIUM',
    phone: '',
    email: '',
    password: '',
    profile_language: Language.FRENCH,
    finished_level: 3,
    created_at: new Date(),
    updated_at: new Date(),
    scope: Subscription.FREEMIUM
  },
  {
    id: "97392b1f-123e-46f6-9e4c-b649e434484c",
    pseudo: 'FREEMIUM',
    phone: '',
    email: '',
    password: '',
    profile_language: Language.FRENCH,
    finished_level: 23,
    created_at: new Date(),
    updated_at: new Date(),
    scope: Subscription.FREEMIUM
  },
  {
    id: "b2ce1bba-d53b-4a09-82e8-c3bbb096c6f8",
    pseudo: 'FREEMIUM',
    phone: '',
    email: '',
    password: '',
    profile_language: Language.WOLOF,
    finished_level: 1,
    created_at: new Date(),
    updated_at: new Date(),
    scope: Subscription.FREEMIUM
  }]
}