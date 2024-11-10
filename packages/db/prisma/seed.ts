// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      name: "Alice Smith",
      phoneNumber: "1234567890",
      safeWord: "help",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Bob Johnson",
      phoneNumber: "0987654321",
      safeWord: "assist",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Charlie Brown",
      phoneNumber: "5555555555",
      safeWord: "emergency",
    },
  });

  // Send Invites
  await prisma.invite.create({
    data: {
      fromId: user1.id,
      toId: user2.id,
      status: "PENDING",
    },
  });

  await prisma.invite.create({
    data: {
      fromId: user1.id,
      toId: user3.id,
      status: "PENDING",
    },
  });

  // Accept Invite and Add Emergency Contact
  // Simulate user2 accepting the invite from user1
  await prisma.invite.update({
    where: {
      fromId_toId: {
        fromId: user1.id,
        toId: user2.id,
      },
    },
    data: {
      status: "ACCEPTED",
    },
  });

  // Add user2 as an emergency contact for user1
  await prisma.emergencyContact.create({
    data: {
      userId: user1.id,
      contactId: user2.id,
    },
  });

  // Reject Invite
  // Simulate user3 rejecting the invite from user1
  await prisma.invite.update({
    where: {
      fromId_toId: {
        fromId: user1.id,
        toId: user3.id,
      },
    },
    data: {
      status: "REJECTED",
    },
  });

  // Create Recordings for user1
  await prisma.recording.createMany({
    data: [
      {
        label: "Angry Conversation",
        s3Link: "https://s3.amazonaws.com/bucket/recording1.wav",
        transcript: "I am very upset with your service.",
        summary: "User expresses dissatisfaction.",
        userId: user1.id,
      },
      {
        label: "Happy Moment",
        s3Link: "https://s3.amazonaws.com/bucket/recording2.wav",
        transcript: "This is the best day ever!",
        summary: "User is very happy.",
        userId: user1.id,
      },
    ],
  });

  // Create a Live Stream for user1
  await prisma.liveStream.create({
    data: {
      uid: "stream1",
      link: "https://livestream.example.com/stream1",
      userId: user1.id,
    },
  });

  console.log("Database has been seeded successfully.");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
