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

const groupsAdmins = [
  {
    group_id: 21,
    user_id: "1f3c0731-5945-4c83-9d30-132590f27c6a",
    assigned_by: "BoyTown"
  },
  {
    group_id: 22,
    user_id: "1f3c0731-5945-4c83-9d30-132590f27c6a",
    assigned_by: "BoyTown"
  },
  {
    group_id: 23,
    user_id: "1f3c0731-5945-4c83-9d30-132590f27c6a",
    assigned_by: "BoyTown"
  },
  {
    group_id: 23,
    user_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
    assigned_by: "PREMIUM1"
  },
  {
    group_id: 24,
    user_id: "1f3c0731-5945-4c83-9d30-132590f27c6a",
    assigned_by: "BoyTown"
  },
  {
    group_id: 25,
    user_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
    assigned_by: "PREMIUM1"
  },
];

const groupsFollowers = [
  {
    group_id: 21,
    user_id: "1f3c0731-5945-4c83-9d30-132590f27c6a",
  },
  {
    group_id: 22,
    user_id: "1f3c0731-5945-4c83-9d30-132590f27c6a",
  },
  {
    group_id: 23,
    user_id: "1f3c0731-5945-4c83-9d30-132590f27c6a",
  },
  {
    group_id: 23,
    user_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
  },
  {
    group_id: 24,
    user_id: "1f3c0731-5945-4c83-9d30-132590f27c6a",
  },
  {
    group_id: 25,
    user_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
  }
];

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
  //deleteData();
  //createUsers();
  createGroups();
}

async function deleteData(){
  await prisma.user.deleteMany();
  await prisma.adminsGroup.deleteMany()
  await prisma.followersGroup.deleteMany()
  await prisma.group.deleteMany()
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

  await setCreatorGroupAsAnAdmin(myUsers);
  await createGroupsRelations(myUsers);
}

async function setCreatorGroupAsAnAdmin(myUsers){
  const assignGroupCreatorId = groups.map((group, index) => {
    return {
      ...group,
      creator_id: index%2==0 ? myUsers[0].id : myUsers[1].id
    }}
  );

  await prisma.group.createMany({ data: assignGroupCreatorId });
}

async function createGroupsRelations(myUsers) {
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