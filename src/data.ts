import { Language, SubscriptionType, UserType } from "@prisma/client";

export interface Data {
  chapters: {
    id: number,
    name: string,
    max_level: number,
    exercises: number[],
    created_at: Date,
    updated_at: Date,
    scope: SubscriptionType
  }[],
  groups: {
    id: number,
    creator_id: string,
    name: string,
    description: string,
    is_public: boolean,
    restricted_access: boolean,
    created_at: Date,
    updated_at: Date,
    admins: [{
      group_id: number,
      user_id: string,
      assigned_at: Date,
      assigned_by: string
    }],
    followers: []
  }[],
  users: {
    id: string,
    pseudo: string,
    phone: string;
    email: string;
    password: string;
    profile_language: Language,
    finished_level: number,
    scope: SubscriptionType
    user_type: UserType
  }[]
}

export const data:Data = {
  chapters: [{
    id: 0,
    name: 'introduction',
    max_level: 4,
    exercises: [1,2,5,6],
    scope: SubscriptionType.FREEMIUM,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 1,
    name: "greetings",
    max_level: 5,
    exercises: [11,12,75,76],
    scope: SubscriptionType.FREEMIUM,
    created_at: new Date(),
    updated_at: new Date(),
  }],
  groups:[{
    id: 1,
    creator_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
    name: "Wolof",
    description: "Apprends le wolof en 1 an avec la Wolof academy",
    is_public: false,
    restricted_access: true,
    created_at: new Date(),
    updated_at: new Date(),
    admins:[{
      group_id: 1,
      user_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
      assigned_at: new Date(),
      assigned_by: "3e0c2835-797f-4b90-bc17-d8c9de8dc95f"
    }],
    followers: []
  },
  {
    id: 2,
    creator_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
    name: "Jangalma",
    description: "Des exercices pour t'améliorer en wolof",
    is_public: false,
    restricted_access: true,
    created_at: new Date(),
    updated_at: new Date(),
    admins:[{
      group_id: 2,
      user_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
      assigned_at: new Date(),
      assigned_by: "3e0c2835-797f-4b90-bc17-d8c9de8dc95f"
    }],
    followers: []
  },
  {
    id: 3,
    creator_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
    name: "Dafa neex",
    description: "Une nouvelle expérience pour t'apprendre le wolof",
    is_public: false,
    restricted_access: true,
    created_at: new Date(),
    updated_at: new Date(),
    admins:[{
      group_id: 3,
      user_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
      assigned_at: new Date(),
      assigned_by: "3e0c2835-797f-4b90-bc17-d8c9de8dc95f"
    }],
    followers: []
  },
  {
    id: 4,
    creator_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
    name: "Wolof Academy",
    description: "Des exercices pour t'améliorer en wolof",
    is_public: false,
    restricted_access: true,
    created_at: new Date(),
    updated_at: new Date(),
    admins:[{
      group_id: 4,
      user_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
      assigned_at: new Date(),
      assigned_by: "3e0c2835-797f-4b90-bc17-d8c9de8dc95f"
    }],
    followers: []
  },
  {
    id: 5,
    creator_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
    name: "Sama cours",
    description: "Une nouvelle expérience pour t'apprendre le wolof",
    is_public: false,
    restricted_access: true,
    created_at: new Date(),
    updated_at: new Date(),
    admins:[{
      group_id: 5,
      user_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
      assigned_at: new Date(),
      assigned_by: "3e0c2835-797f-4b90-bc17-d8c9de8dc95f"
    }],
    followers: []
  }],
  users: [{
    id: "3e0c2835-797f-4b90-bc17-d8c9de8dc95f",
    pseudo: 'SUPER ADMIN',
    phone: '01324354600',
    email: 'superadmin@oui.sn',
    password: 'pass<ord123',
    profile_language: Language.ENGLISH,
    finished_level: 0,
    scope: SubscriptionType.PREMIUM,
    user_type: UserType.SUPER_ADMIN
  },
  {
    id: "d3a8a76d-cdc0-4b58-8ee3-6f51769c7141",
    pseudo: 'PREMIUM1',
    phone: '01324354600',
    email: 'boytown2@oui.sn',
    password: 'pass<ord123',
    profile_language: Language.ENGLISH,
    finished_level: 1,
    scope: SubscriptionType.PREMIUM,
    user_type: UserType.ADMIN
  },
  {
    id: "9f904e30-8ba2-4e57-9bc3-3af0954c370e",
    pseudo: 'PREMIUM2',
    phone: '01324354600',
    email: 'boytown23@oui.sn',
    password: 'pass<ord123',
    profile_language: Language.ENGLISH,
    finished_level: 4,
    scope: SubscriptionType.PREMIUM,
    user_type: UserType.ADMIN
  },
  {
    id: "4728888a-2083-4db9-b10d-a41cfe71c243",
    pseudo: 'FREEMIUM1',
    phone: '01324354600',
    email: 'boytown24@oui.sn',
    password: 'pass<ord123',
    profile_language: Language.ENGLISH,
    finished_level: 54,
    scope: SubscriptionType.FREEMIUM,
    user_type: UserType.USER
  },
  {
    id: "0c314736-345a-46d1-a644-cab475b19e71",
    pseudo: 'FREEMIUM2',
    phone: '01324354600',
    email: 'boytown25@oui.sn',
    password: 'pass<ord123',
    profile_language: Language.FRENCH,
    finished_level: 3,
    scope: SubscriptionType.FREEMIUM,
    user_type: UserType.USER
  },
  {
    id: "fbaaa325-6b9a-4ee9-a76b-f9f3b88e2c26",
    pseudo: 'FREEMIUM3',
    phone: '01324354600',
    email: 'boytown26@oui.sn',
    password: 'pass<ord123',
    profile_language: Language.FRENCH,
    finished_level: 23,
    scope: SubscriptionType.FREEMIUM,
    user_type: UserType.USER
  },
  {
    id: "b1b73451-ef58-48ca-b6e5-188358c30fc1",
    pseudo: 'FREEMIUM4',
    phone: '01324354600',
    email: 'boytown27@oui.sn',
    password: 'pass<ord123',
    profile_language: Language.WOLOF,
    finished_level: 1,
    scope: SubscriptionType.FREEMIUM,
    user_type: UserType.USER
  }]
}
