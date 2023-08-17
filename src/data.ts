interface Users {
  users: {
    id: string,
    pseudo: string,
    level: number,
    created_at: Date,
    updated_at: Date,
    accountType: AccountType
  }[]
}

export enum AccountType {
  PREMIUM = 'premium',
  FREEMIUM = 'freemium'
}

export const data:Users = {
  users: [{
    id: "834e0b68-6926-4329-b346-3e6e61613b94",
    pseudo: 'PREMIUM',
    level: 1,
    created_at: new Date(),
    updated_at: new Date(),
    accountType: AccountType.PREMIUM
  },
  {
    id: "575e7b94-ebf4-4e30-9478-969c85e9baf9",
    pseudo: 'PREMIUM',
    level: 4,
    created_at: new Date(),
    updated_at: new Date(),
    accountType: AccountType.PREMIUM
  },
  {
    id: "4c609110-0c6d-4217-aad9-792d506b686f",
    pseudo: 'FREEMIUM',
    level: 54,
    created_at: new Date(),
    updated_at: new Date(),
    accountType: AccountType.FREEMIUM
  },
  {
    id: "2477c3be-f9fe-4b2d-8784-8fa5cae3b8ec",
    pseudo: 'FREEMIUM',
    level: 3,
    created_at: new Date(),
    updated_at: new Date(),
    accountType: AccountType.FREEMIUM
  },
  {
    id: "97392b1f-123e-46f6-9e4c-b649e434484c",
    pseudo: 'FREEMIUM',
    level: 23,
    created_at: new Date(),
    updated_at: new Date(),
    accountType: AccountType.FREEMIUM
  },
  {
    id: "b2ce1bba-d53b-4a09-82e8-c3bbb096c6f8",
    pseudo: 'FREEMIUM',
    level: 1,
    created_at: new Date(),
    updated_at: new Date(),
    accountType: AccountType.FREEMIUM
  }]
}