import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
    {
        email: 'admin.admin@groupomania.fr',
        firstName: 'admin',
        lastName: 'admin',
        password: '$2b$12$024o3crNp5Ii0rYCtI7Mo.rUj7R7jUdeE2uSl24Q4Br0NuuITzgJ',
        avatar: null,
        background: null,
        role:'ADMIN',
    },
    {
        email: 'lefeuvre.jerome@groupomania.fr',
        firstName: 'jerome',
        lastName: 'lefeuvre',
        password: '$2b$12$12ALM8OaQDpJfup0hFOTY.cSvbXkuPktnJUC01PHoOeJ6M5p72Z3O',
        avatar: null,
        background: null,
        role:'MODERATOR',
        post: {
            create: [
                {
                    title: 'test 1',
                    content: 'content test 1',
                    image: null,
                    updatedBy: null,
                },
                {
                    title: 'test 2',
                    content: 'content test 2',
                    image: null,
                    updatedBy: null,
                },
                {
                    title: 'test 3',
                    content: 'content test 3',
                    image: null,
                    updatedBy: null,
                },
            ]
        },
        comment: {
            create : [
                {
                    content: 'test comm 1',
                    postId: 2,
                },
                {
                    content: 'test comm 2',
                    postId: 3,
                },
            ]
        },
        like: {
            create: [
                {
                    postId: 3,
                },
                {
                    postId: 2,
                },
                {
                    postId: 1,
                },
            ]
        }
    },
    {
        email: 'lefeuvre.armel@groupomania.fr',
        firstName: 'armel',
        lastName: 'lefeuvre',
        password: '$2b$12$qJyddzg4QUS.NwnFbBcOt.HlAFwxKQZbQsDpRRT4VZ5B/nqH6alLW',
        avatar: null,
        background: null,
        role:'USER',
        post: {
            create: [
                {
                    title: 'test 4',
                    content: 'content test 4',
                    image: null,
                    updatedBy: null,
                },
                {
                    title: 'test 5',
                    content: 'content test 5',
                    image: null,
                    updatedBy: null,
                },
                {
                    title: 'test 6',
                    content: 'content test 6',
                    image: null,
                    updatedBy: null,
                },
            ]
        },
        comment: {
            create : [
                {
                    content: 'test comm 3',
                    postId: 2,
                },
                {
                    content: 'test comm 4',
                    postId: 1,
                },
            ]
        },
        like: {
            create: [
                {
                    postId: 5,
                },
                {
                    postId: 2,
                },
                {
                    postId: 4,
                },
            ]
        }
    },
    {
        email: 'lefeuvre.catherine@groupomania.fr',
        firstName: 'catherine',
        lastName: 'lefeuvre',
        password: '$2b$12$qJyddzg4QUS.NwnFbBcOt.HlAFwxKQZbQsDpRRT4VZ5B/nqH6alLW',
        avatar: null,
        background: null,
        role:'USER',
        post: {
            create: [
                {
                    title: 'test 7',
                    content: 'content test 7',
                    image: null,
                    updatedBy: null,
                },
                {
                    title: 'test 8',
                    content: 'content test 8',
                    image: null,
                    updatedBy: null,
                },
                {
                    title: 'test 9',
                    content: 'content test 9',
                    image: null,
                    updatedBy: null,
                },
            ]
        },
        comment: {
            create : [
                {
                    content: 'test comm 5',
                    postId: 6,
                },
                {
                    content: 'test comm 6',
                    postId: 4,
                },
            ]
        },
        like: {
            create: [
                {
                    postId: 9,
                },
                {
                    postId: 6,
                },
                {
                    postId: 1,
                },
            ]
        }
    },
    {
        email: 'lefeuvre.matthieu@groupomania.fr',
        firstName: 'matthieu',
        lastName: 'lefeuvre',
        password: '$2b$12$q5Jh1XJVJiwqOdEFl9BBo.W8l5dy71QIeYaL5buIn7Vj1rHprJLb2',
        avatar: null,
        background: null,
        role:'USER',
        post: {
            create: [
                {
                    title: 'test 10',
                    content: 'content test 10',
                    image: null,
                    updatedBy: null,
                },
                {
                    title: 'test 11',
                    content: 'content test 11',
                    image: null,
                    updatedBy: null,
                },
                {
                    title: 'test 12',
                    content: 'content test 12',
                    image: null,
                    updatedBy: null,
                },
            ]
        },
        comment: {
            create : [
                {
                    content: 'test comm 7',
                    postId: 9,
                },
                {
                    content: 'test comm 8',
                    postId: 10,
                },
            ]
        },
        like: {
            create: [
                {
                    postId: 11,
                },
                {
                    postId: 6,
                },
                {
                    postId: 1,
                },
            ]
        }
    },
]

async function main() {
    console.log(`Start seeding ...`)
    for (const u of userData) {
        console.log(u)
        const user = await prisma.user.create({
            data: u,
        })
        console.log(`Created user with id: ${user.id}`)
    }
    console.log(`Seeding finished.`)
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