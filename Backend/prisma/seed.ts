import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
    {
        email: "admin.admin@groupomania.fr",
        firstName: "admin",
        lastName: "admin",
        password: "$2b$12$/EoM3UKSueKcc0yqcGHHM.OZD48hyyVYdmjlksoDe.0tk87UEklVW",
        avatar: null,
        background: null,
        role: "ADMIN",
    },
    {
        email: "dupond.marc@groupomania.fr",
        firstName: "marc",
        lastName: "dupond",
        password: "$2b$12$12ALM8OaQDpJfup0hFOTY.cSvbXkuPktnJUC01PHoOeJ6M5p72Z3O",
        avatar: null,
        background: null,
        role: "USER",
        post: {
            create: [
                {
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ultrices felis nec pretium iaculis. Sed sit amet ante justo. Sed eu quam a elit condimentum ultricies. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus at arcu eu sapien fermentum accumsan a at ipsum. Sed rhoncus ornare velit vel dapibus. Aliquam hendrerit mauris ut dui rhoncus rutrum. Aliquam quis cursus justo.",
                    image: null,
                    updatedBy: null,
                }
            ],
        },
        comment: {
            create: [
                {
                    content: "Duis nulla elit, aliquam tristique gravida at, rutrum a nunc.",
                    postId: 1,
                }
            ],
        },
        like: {
            create: [
                {
                    postId: 1,
                }
            ],
        },
    },
    {
        email: "noel.pere@groupomania.fr",
        firstName: "pere",
        lastName: "noel",
        password: "$2b$12$12ALM8OaQDpJfup0hFOTY.cSvbXkuPktnJUC01PHoOeJ6M5p72Z3O",
        avatar: null,
        background: null,
        role: "USER",
        post: {
            create: [
                {
                    content: "Vivamus vitae tincidunt ipsum. Maecenas congue tincidunt faucibus. Curabitur ut sollicitudin enim, nec pulvinar justo. Aliquam porta ultricies sodales. Duis iaculis viverra volutpat. Nunc semper nulla dui, at porta arcu interdum non. Pellentesque nulla quam, consequat eu arcu at, ullamcorper auctor lectus. Proin sagittis pretium tincidunt. Integer condimentum gravida dictum.",
                    image: null,
                    updatedBy: null,
                }
            ],
        },
        comment: {
            create: [
                {
                    content: "Donec risus est, faucibus sed blandit sed, hendrerit ut ex.",
                    postId: 1,
                }
            ],
        },
        like: {
            create: [
                {
                    postId: 1,
                }
            ],
        },
    },
    {
        email: "smith.john@groupomania.fr",
        firstName: "john",
        lastName: "smith",
        password: "$2b$12$12ALM8OaQDpJfup0hFOTY.cSvbXkuPktnJUC01PHoOeJ6M5p72Z3O",
        avatar: null,
        background: null,
        role: "USER",
        post: {
            create: [
                {
                    content: "Vestibulum et arcu orci. Integer aliquam quis lacus id sollicitudin. Nulla facilisi. Integer maximus nulla libero, at malesuada risus sagittis vitae. Vestibulum lacus eros, egestas quis ex at, vehicula posuere libero.",
                    image: null,
                    updatedBy: null,
                }
            ],
        },
        comment: {
            create: [
                {
                    content: "Nullam eu ex pulvinar, placerat orci vel, condimentum sem.",
                    postId: 2,
                }
            ],
        },
        like: {
            create: [
                {
                    postId: 1,
                }
            ],
        },
    }
];

async function main() {
    console.log("Start seeding ...");
    for (const u of userData) {
        console.log(u);
        const user = await prisma.user.create({
            data: u,
        });
        console.log(`Created user with id: ${user.id}`);
    }
    console.log("Seeding finished.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
