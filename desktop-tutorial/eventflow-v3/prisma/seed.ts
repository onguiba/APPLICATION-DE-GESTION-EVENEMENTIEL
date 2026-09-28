import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Création du compte administrateur TchadEvent...');

  const adminEmail = 'admin@tchadevent.td';
  const adminPassword = 'Admin@TchadEvent2026';

  // Check if admin already exists
  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log('✅ Compte administrateur déjà existant :', adminEmail);
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Administrateur TchadEvent',
      phone: '+235 00 00 00 00',
      role: 'admin',
      accountType: 'Organisateur',
    },
  });

  console.log('');
  console.log('✅ Compte administrateur créé avec succès !');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Email    :', adminEmail);
  console.log('🔑 Mot de passe :', adminPassword);
  console.log('🛡️  Rôle    : admin');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⚠️  Changez le mot de passe après la première connexion !');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
