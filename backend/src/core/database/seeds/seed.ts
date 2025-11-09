import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../../modules/auth/entities/user.entity';
import { dataSourceOptions } from '../data-source';

async function seed() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  // Check if demo user already exists
  const existingUser = await userRepository.findOne({
    where: { email: 'demo@demo.com' },
  });

  if (existingUser) {
    console.log('✅ Demo user already exists');
    await dataSource.destroy();
    return;
  }

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const demoUser = userRepository.create({
    username: 'demo',
    email: 'demo@demo.com',
    password: hashedPassword,
    firstName: 'Demo',
    lastName: 'User',
  });

  await userRepository.save(demoUser);
  console.log('✅ Demo user created successfully');
  console.log('   Email: demo@demo.com');
  console.log('   Password: demo123');

  await dataSource.destroy();
}

seed()
  .then(() => {
    console.log('🌱 Seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
