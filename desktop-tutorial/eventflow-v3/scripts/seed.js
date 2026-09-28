const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Remplissage de la base de données...');

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
    console.log(`✅ ${users.length} utilisateurs créés`);

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
    console.log(`✅ ${events.length} événements créés`);

    // Create participants and payments
    let totalPayments = 0;
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
          const payment = await prisma.payment.create({
            data: {
              participantId: participant.id,
              eventId: event.id,
              amount: participant.amount,
              method: ['MoMo', 'OrangeMoney', 'Card'][Math.floor(Math.random() * 3)],
              reference: `REF-${Date.now()}-${Math.random().toString().slice(2, 8)}`,
              status: Math.random() > 0.1 ? 'completed' : 'pending',
            },
          });
          if (payment.status === 'completed') {
            totalPayments += payment.amount;
          }
        }
      }
    }
    console.log(`✅ Paiements créés - Total: $${totalPayments.toFixed(2)}`);

    console.log('\n✨ Base de données remplie avec succès!');
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
