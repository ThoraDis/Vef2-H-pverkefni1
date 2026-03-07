import { prisma } from "../src/prisma.js";

const numOfEvents = 8;
const ticketsPerEvent = 4;
const boughtTicketsRatio = 1 / 2;

async function createPlace(i: number) {
  return await prisma.place.create({
    data: {
      email: `place${i}@example.org`,
      address: `Random Street ${i}`,
    },
  });
}

async function createEvent(i: number, placeId: number) {
  return await prisma.event.create({
    data: {
      title: `Random Event Nr.${i}`,
      description: `A facinating description of the event`,
      placeID: placeId, 
    },
  });
}

async function createImage(i: number, eventId: number) {
  await prisma.image.create({
    data: {
      image: `test-image-${i}`,
      eventId: eventId,
    },
  });
}

async function createMedia(i: number, eventId: number) {
  await prisma.media.create({
    data: {
      eventId: eventId,
      ...(i < numOfEvents / 2 && { facebook: `facebook-${i}` }),
      ...(i >= numOfEvents / 4 &&
        i < (2 * numOfEvents) / 3 && { website: `website-${i}` }),
    },
  });
}

async function createUser(i: number) {
  return await prisma.user.create({
    data: {
      email: `user${i}@example.org`,
      username: `usernr${i}`,
    },
  });
}

async function createTicket(i: number, eventId: number, userId?: string) {
  await prisma.ticket.create({
    data: {
      eventId: eventId,
       userId: userId ,
    },
  });
}

async function main() {
  await prisma.ticket.deleteMany();
  await prisma.image.deleteMany();
  await prisma.media.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.place.deleteMany();

  const places = [];
  for (let i = 0; i < numOfEvents / 2; i++) {
    places.push(await createPlace(i));
  }

  const events = [];
  for (let i = 0; i < numOfEvents; i++) {
    const placeId = places[i % (numOfEvents / 2)].id;
    const event = await createEvent(i, placeId);
    events.push(event);

    await createImage(i * 2, event.id);
    await createImage(i * 2 + 1, event.id);
    await createMedia(i, event.id);
  }

  const users = [];
  const numUsers = numOfEvents * ticketsPerEvent * boughtTicketsRatio;
  for (let i = 0; i < numUsers; i++) {
    users.push(await createUser(i));
  }

  for (let i = 0; i < numOfEvents * ticketsPerEvent; i++) {
    const eventId = events[i % numOfEvents].id; 
    const user = users[i] ? users[i].id : undefined;
    await createTicket(i, eventId, user);
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
