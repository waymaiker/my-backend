interface Users {
  users: {
    id: string,
    pseudo: string,
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
    id: "0",
    pseudo: 'PREMIUM',
    created_at: new Date(),
    updated_at: new Date(),
    accountType: AccountType.PREMIUM
  },
  {
    id: "1",
    pseudo: 'PREMIUM',
    created_at: new Date(),
    updated_at: new Date(),
    accountType: AccountType.PREMIUM
  },
  {
    id: "2",
    pseudo: 'FREEMIUM',
    created_at: new Date(),
    updated_at: new Date(),
    accountType: AccountType.FREEMIUM
  },
  {
    id: "3",
    pseudo: 'FREEMIUM',
    created_at: new Date(),
    updated_at: new Date(),
    accountType: AccountType.FREEMIUM
  },
  {
    id: "4",
    pseudo: 'FREEMIUM',
    created_at: new Date(),
    updated_at: new Date(),
    accountType: AccountType.FREEMIUM
  },
  {
    id: "5",
    pseudo: 'FREEMIUM',
    created_at: new Date(),
    updated_at: new Date(),
    accountType: AccountType.FREEMIUM
  }]
}