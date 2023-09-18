import * as bcrypt from 'bcryptjs';
import { ConflictException } from '@nestjs/common'
import { Language, Prisma, PrismaClient, SubscriptionType, UserType } from '@prisma/client'
import { CreateUserDto } from '../user/dtos/user.dto';

const prisma = new PrismaClient()

const users = [{
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

const groups = [
  {
    creator_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
    name: "Wolof",
    description: "Apprends le wolof en 1 an avec la Wolof academy",
    is_public: false,
    restricted_access: true
  },
  {
    creator_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
    name: "Jangalma",
    description: "Des exercices pour t'améliorer en wolof",
    is_public: false,
    restricted_access: true
  },
  {
    creator_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
    name: "Dafa neex",
    description: "Une nouvelle expérience pour t'apprendre le wolof",
    is_public: false,
    restricted_access: true
  },
  {
    creator_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
    name: "Wolof Academy",
    description: "Des exercices pour t'améliorer en wolof",
    is_public: false,
    restricted_access: true
  },
  {
    creator_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
    name: "Sama cours",
    description: "Une nouvelle expérience pour t'apprendre le wolof",
    is_public: false,
    restricted_access: true
  }
];

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
  const usersCount = await prisma.user.count()
  const groupsCount = await prisma.group.count()
  const groupsAdmins = await prisma.adminsGroup.count()
  const groupsFollowers = await prisma.followersGroup.count()

  if(usersCount == 0){
    createUsers();
    console.log('\n');
    console.log(" ---- Users have been created ----");
  } else if(usersCount>0 && groupsCount == 0){
    createGroups();
    console.log('\n');
    console.log(" ---- Groups have been created ----");
  } else if(usersCount > 0 && groupsCount > 0 && (groupsAdmins === 0 && groupsFollowers === 0)){
    createGroupsAdminsAndFollowers()
    console.log('\n');
    console.log(" ---- Groups Admins and Followers have been created ----");
  } else {
    deleteData()
    console.log('\n');
    console.log(" ---- All data have been deleted ----");
  }

}

async function deleteData(){
  await prisma.adminsGroup.deleteMany()
  await prisma.followersGroup.deleteMany()
  await prisma.group.deleteMany()
  await prisma.user.deleteMany();
}

function createUsers(){
 users.map((user) => createUser(user));
}

async function createGroups(){
  const myUsers = await prisma.user.findMany({
    where: {
      user_type: UserType.ADMIN
    }
  });

  const assignGroupCreatorId = groups.map((group, index) => {
    return {
      ...group,
      creator_id: index%2==0 ? myUsers[0].id : myUsers[1].id
    }}
  );

  await prisma.group.createMany({ data: assignGroupCreatorId });
}

async function createGroupsAdminsAndFollowers() {
  const myUsers = await prisma.user.findMany({
    where: {
      user_type: UserType.ADMIN
    }
  });

  const groupsById = await prisma.group.findMany({
    select: {
      id: true
    },
    take: 6
  })

  const updateGroupIdOfFollowers = groupsById.map((group, index) => {
    return {
      group_id: group.id,
      user_id: index%2==0 ? myUsers[0].id : myUsers[1].id
    }}
  );

  const updateGroupIdOfAdmins = groupsById.map((group, index) => {
    return {
      group_id: group.id,
      user_id: index%2==0 ? myUsers[0].id : myUsers[1].id,
      assigned_by: index%2==0 ? myUsers[0].id : myUsers[1].id,
    }}
  );

  await prisma.adminsGroup.createMany({ data: updateGroupIdOfAdmins });
  await prisma.followersGroup.createMany({ data: updateGroupIdOfFollowers });
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