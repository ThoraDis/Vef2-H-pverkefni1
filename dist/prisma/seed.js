import { prisma } from "../src/prisma.js";
const numOfEvents = 8;
const ticketsPerEvent = 4;
const boughtTicketsRatio = 1 / 2;
async function upsertPlace(i) {
    await prisma.place.upsert({
        where: { id: i },
        update: {},
        create: {
            id: i,
            email: `place${i}@example.org`,
            address: `Random Street ${i}`,
        },
    });
}
async function upsertEvent(i) {
    await prisma.event.upsert({
        where: { id: i },
        update: {},
        create: {
            id: i,
            title: `Random Event Nr.${i}`,
            description: `A facinating description of the event`,
            placeID: i % (numOfEvents / 2),
        },
    });
}
async function upsertImage(i) {
    await prisma.image.upsert({
        where: { id: i },
        update: {},
        create: {
            id: i,
            image: `test-image-${i}`,
            eventId: i % numOfEvents,
        },
    });
}
async function upsertMedia(i) {
    await prisma.media.upsert({
        where: { id: i },
        update: {},
        create: {
            id: i,
            eventId: i,
            ...(i < numOfEvents / 2 && { facebook: `facebook-${i}` }),
            ...(i >= numOfEvents / 4 &&
                i < (2 * numOfEvents) / 3 && { website: `website-${i}` }),
        },
    });
}
async function upsertUser(i) {
    await prisma.user.upsert({
        where: { id: i },
        update: {},
        create: {
            id: i,
            email: `user${i}@example.org`,
        },
    });
}
async function upsertTicket(i) {
    await prisma.ticket.upsert({
        where: { id: i },
        update: {},
        create: {
            id: i,
            eventId: i % ticketsPerEvent,
            ...(i < numOfEvents * ticketsPerEvent * boughtTicketsRatio && {
                userId: i,
            }),
        },
    });
}
async function main() {
    await prisma.image.deleteMany();
    await prisma.media.deleteMany();
    for (let i = 0; i < numOfEvents / 2; i++) {
        await upsertPlace(i);
    }
    for (let i = 0; i < numOfEvents; i++) {
        await upsertEvent(i);
        await upsertImage(i * 2);
        await upsertImage(i * 2 + 1);
        await upsertMedia(i);
    }
    for (let i = 0; i < numOfEvents * ticketsPerEvent * boughtTicketsRatio; i++) {
        await upsertUser(i);
    }
    for (let i = 0; i < numOfEvents * ticketsPerEvent; i++) {
        await upsertTicket(i);
    }
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
