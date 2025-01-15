import { PrismaClient, UserRole } from '@prisma/client'; // Import UserRole enum from Prisma schema
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Create some companies
  const companyData = [];
  for (let i = 0; i < 3; i++) {
    companyData.push({
      name: faker.company.name(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });
  }

  // Create companies one by one to retrieve their `id`s for user creation
  const createdCompanies = [];
  for (const company of companyData) {
    const createdCompany = await prisma.company.create({
      data: company,
    });
    createdCompanies.push(createdCompany); // Store the created company to use `id` later
  }

  console.log(`Created ${createdCompanies.length} companies`);

  // Create users for each company
  for (const company of createdCompanies) {
    const userData = [
      {
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: UserRole.MANAGER, // Use the enum UserRole
        companyId: company.id, // Assign the companyId correctly
      },
      {
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: UserRole.ADMIN, // Use the enum UserRole
        companyId: company.id, // Assign the companyId correctly
      },
    ];

    await prisma.user.createMany({
      data: userData,
    });

    console.log(`Created users for company ${company.name}`);

    // Create vehicles for the company
    const vehiculeData = [];
    for (let j = 0; j < 5; j++) {
      vehiculeData.push({
        privateVehicule: faker.datatype.boolean(),
        plate: faker.vehicle.vrm(),
        name: faker.vehicle.model(),
        brand: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        year: faker.date.anytime().getFullYear(), // Adjust year as requested
        pictureUrl: faker.image.avatar(), // Correct image reference
        lastChecked: faker.date.recent(),
        lastStarted: faker.date.recent(),
        lastMaintenance: faker.date.recent(),
        km: faker.number.int({ min: 0, max: 200000 }),
        status: faker.helpers.arrayElement(['OK', 'MAINTENANCE_NEEDED']),
        atCompany: true,
        location: faker.location.streetAddress(),
        loanedTo: faker.company.name(),
        createdAt: new Date(),
        updatedAt: new Date(),
        companyId: company.id, // Assign the companyId correctly
      });
    }

    const vehicles = await prisma.vehicule.createMany({
      data: vehiculeData,
    });

    console.log(`Created vehicles for company ${company.name}`);

    // Now we create the maintenance checklists for each vehicle
    for (const vehicule of vehiculeData) {
      // Retrieve the vehicle's id after creation
      const createdVehicule = await prisma.vehicule.findFirst({
        where: { plate: vehicule.plate }, // Using plate as a unique identifier
      });

      if (createdVehicule) {
        // Now create the maintenance checklist and link it to the created vehicule
        const checklistData = {
          status: 'Pending',
          vehiculeId: createdVehicule.id, // Assign the vehiculeId here
          // No need for createdAt and updatedAt as Prisma auto-generates them
        };

        await prisma.maintenanceChecklist.create({
          data: checklistData,
        });

        console.log(`Created maintenance checklist for vehicle ${createdVehicule.name}`);
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
