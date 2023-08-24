import * as bcrypt from 'bcryptjs';
import { ConflictException } from '@nestjs/common'
import { Language, Prisma, PrismaClient, SubscriptionType, UserType } from '@prisma/client'
import { CreateUserDto } from 'src/user/dtos/user.dto';

const prisma = new PrismaClient()

const users = [{
  pseudo: 'PREMIUM1',
  phone: '01324354600',
  email: 'boytown2@oui.sn',
  password: 'pass<ord123',
  profile_language: Language.ENGLISH,
  finished_level: 1,
  scope: SubscriptionType.PREMIUM,
  user_type: UserType.USER
},
{
  pseudo: 'PREMIUM2',
  phone: '01324354600',
  email: 'boytown23@oui.sn',
  password: 'pass<ord123',
  profile_language: Language.ENGLISH,
  finished_level: 4,
  scope: SubscriptionType.PREMIUM,
  user_type: UserType.USER
},
{
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
  pseudo: 'FREEMIUM4',
  phone: '01324354600',
  email: 'boytown27@oui.sn',
  password: 'pass<ord123',
  profile_language: Language.WOLOF,
  finished_level: 1,
  scope: SubscriptionType.FREEMIUM,
  user_type: UserType.USER
}]

const groups =[
  {
    name: "Wolof",
    description: "Apprends le wolof en 1 an avec la Wolof academy",
    isPublic: false,
    restricted_access: true
  },
  {
    name: "Jangalma",
    description: "Des exercices pour t'améliorer en wolof",
    isPublic: false,
    restricted_access: true
  },
  {
    name: "Dafa neex",
    description: "Une nouvelle expérience pour t'apprendre le wolof",
    isPublic: false,
    restricted_access: true
  }
]

async function createUser({pseudo, phone, email, password, profile_language, user_type, scope}: CreateUserDto){
  const emailAlreadyUsed = await prisma.user.findUnique({
    where: {
      email: email
    }
  })

  if(emailAlreadyUsed){
    throw new ConflictException("This email is already used")
  }

  const pseudoAlreadyUsed = await prisma.user.findUnique({
    where: {
      pseudo: pseudo
    }
  })

  if(pseudoAlreadyUsed){
    throw new ConflictException("This pseudo is already used");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  let dataToCreateUser: Prisma.UserCreateInput = {
    email,
    phone,
    password: hashedPassword,
    profile_language,
    pseudo: pseudo,
    finished_level: 0,
    scope,
    user_type
  };

  await prisma.user.create({ data: dataToCreateUser })
}

async function main() {
  users.map((user) => createUser(user));
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })