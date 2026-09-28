import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.budgetCategory.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = [];
  for (let i = 1; i <= 15; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        password: await bcrypt.hash('password123', 10),
        name: `Utilisateur ${i}`,
        phone: `+237${Math.random().toString().slice(2, 11)}`,
        accountType: i % 3 === 0 ? 'Prestataire' : i % 2 === 0 ? 'Participant' : 'Organisateur',
      },
    });
    users.push(user);
  }

  // Create events
  const events = [];
  for (let i = 1; i <= 25; i++) {
    const event = await prisma.event.create({
      data: {
        userId: users[Math.floor(Math.random() * users.length)].id,
        name: `Événement ${i}`,
        date: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: `Lieu ${i}`,
        capacity: Math.floor(Math.random() * 500) + 50,
        status: ['Planifié', 'En cours', 'Terminé'][Math.floor(Math.random() * 3)],
        type: ['Conférence', 'Mariage', 'Séminaire', 'Concert'][Math.floor(Math.random() * 4)],
        description: `Description de l'événement ${i}`,
      },
    });
    events.push(event);
  }

  // Create budgets and categories
  for (const event of events) {
    const budget = await prisma.budget.create({
      data: {
        eventId: event.id,
        totalAmount: Math.random() * 50000 + 5000,
        status: 'Approuvé',
      },
    });

    const categories = ['Catering', 'Décoration', 'Transport', 'Équipement', 'Personnel'];
    for (const category of categories) {
      await prisma.budgetCategory.create({
        data: {
          budgetId: budget.id,
          name: category,
          allocatedAmount: Math.random() * 10000 + 1000,
          spent: Math.random() * 5000,
        },
      });
    }
  }

  // Create participants and payments
  for (const event of events) {
    const participantCount = Math.floor(Math.random() * 100) + 10;
    for (let i = 0; i < participantCount; i++) {
      const participant = await prisma.participant.create({
        data: {
          eventId: event.id,
          name: `Participant ${i + 1}`,
          email: `participant${i}@example.com`,
          phone: `+237${Math.random().toString().slice(2, 11)}`,
          status: ['Confirmé', 'En attente', 'Annulé'][Math.floor(Math.random() * 3)],
          paymentStatus: ['Payé', 'En attente', 'Remboursé'][Math.floor(Math.random() * 3)],
          amount: Math.random() * 100 + 10,
        },
      });

      // Create payment for participant
      if (Math.random() > 0.3) {
        await prisma.payment.create({
          data: {
            participantId: participant.id,
            eventId: event.id,
            amount: participant.amount,
            method: ['MoMo', 'OrangeMoney', 'Card'][Math.floor(Math.random() * 3)],
            reference: `REF-${Date.now()}-${Math.random().toString().slice(2, 8)}`,
            status: Math.random() > 0.1 ? 'completed' : 'pending',
          },
        });
      }
    }
  }

  // Create expenses
  for (const event of events) {
    const expenseCount = Math.floor(Math.random() * 10) + 2;
    for (let i = 0; i < expenseCount; i++) {
      await prisma.expense.create({
        data: {
          eventId: event.id,
          category: ['Catering', 'Décoration', 'Transport', 'Équipement'][Math.floor(Math.random() * 4)],
          description: `Dépense ${i + 1}`,
          amount: Math.random() * 5000 + 100,
          date: new Date().toISOString().split('T')[0],
        },
      });
    }
  }

  // Create notifications
  for (const user of users) {
    for (let i = 0; i < 3; i++) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: ['alert', 'success', 'info'][Math.floor(Math.random() * 3)],
          message: `Notification ${i + 1}`,
          channel: ['Email', 'SMS', 'Push'][Math.floor(Math.random() * 3)],
          read: Math.random() > 0.5,
        },
      });
    }
  }

  console.log('✅ Base de données remplie avec succès!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
