const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Web Development" },
        { name: "Software Development" },
        { name: "Data Science" },
        { name: "Graphic Designer" },
        { name: "Digital Marketing" },
        { name: "Cyber Security" },
      ],
    });

    console.log("Success");
  } catch (error) {
    console.log("Error seeding the db category", error);
  } finally {
    await database.$disconnect();
  }
}

main();
