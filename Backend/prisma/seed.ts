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
