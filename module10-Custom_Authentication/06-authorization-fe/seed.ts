import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import bcrypt from 'bcrypt';
import mongoose, { model, Schema } from 'mongoose';

const envPath = resolve(__dirname, 'auth-server/.env.development.local');

const loadEnvFile = (filePath: string) => {
  if (!existsSync(filePath)) return;

  const env = readFileSync(filePath, 'utf8');

  for (const line of env.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^([\w.-]+)\s*=\s*(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;

    let value = rawValue.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
};

loadEnvFile(envPath);

const dbName = process.env.DB_NAME ?? 'travel-journal';
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error(`MONGO_URI is required to run the seed script. Checked ${envPath}`);
}

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
      type: [String],
      default: ['user'],
    },
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    image: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: 'posts',
  },
);

const SeedUser = mongoose.models.SeedUser ?? model('SeedUser', userSchema);
const SeedPost = mongoose.models.SeedPost ?? model('SeedPost', postSchema);

const defaultPassword = 'Password123';
const aangPassword = 'Aangpass123!';
const kataraPassword = 'Katarapass123!';
const zukoPassword = 'Zukopass123!';

type SeedUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
};

type SeededUser = {
  _id: mongoose.Types.ObjectId;
  email: string;
};

type SeedPostInput = {
  title: string;
  image: string;
  content: string;
  authorEmail: string;
};

const seedUsers: SeedUserInput[] = [
  {
    firstName: 'Mia',
    lastName: 'Rossi',
    email: 'mia.rossi@teaching.local',
    password: defaultPassword,
    roles: ['admin', 'user'],
  },
  {
    firstName: 'Noah',
    lastName: 'Berg',
    email: 'noah.berg@teaching.local',
    password: defaultPassword,
    roles: ['user'],
  },
  {
    firstName: 'Lea',
    lastName: 'Keller',
    email: 'lea.keller@teaching.local',
    password: defaultPassword,
    roles: ['user'],
  },
  {
    firstName: 'Omar',
    lastName: 'Neumann',
    email: 'omar.neumann@teaching.local',
    password: defaultPassword,
    roles: ['user'],
  },
  {
    firstName: 'Aang',
    lastName: 'Air',
    email: 'aang@air.com',
    password: aangPassword,
    roles: ['user'],
  },
  {
    firstName: 'Katara',
    lastName: 'Water',
    email: 'katara@water.com',
    password: kataraPassword,
    roles: ['user'],
  },
  {
    firstName: 'Zuko',
    lastName: 'Fire',
    email: 'zuko@fire.com',
    password: zukoPassword,
    roles: ['user'],
  },
];

const seedPosts: SeedPostInput[] = [
  {
    title: 'Sicily: A Culinary and Historical Epicenter in the Mediterranean',
    image:
      'https://www.homeinitaly.com/_data/magazine/articles/2025-03-20-what-is-the-most-beautiful-town-in-sicily/what-is-the-most-beautiful-town-in-sicily-1.jpg',
    content:
      'Sicily feels like a whole continent packed into one island: ancient ruins, busy markets, volcanic views, and some of the best food in Europe.',
    authorEmail: 'mia.rossi@teaching.local',
  },
  {
    title: "Santorini: Chasing the World's Most Famous Sunset",
    image:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    content:
      'White houses, blue domes, and dramatic cliffs make Santorini an easy place to explain why people plan entire trips around sunset.',
    authorEmail: 'noah.berg@teaching.local',
  },
  {
    title: 'Cinque Terre: Hiking Through a Colorful Italian Dream',
    image:
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    content:
      'Cinque Terre is a great example of how a short coastal hike can feel like a moving postcard from village to village.',
    authorEmail: 'lea.keller@teaching.local',
  },
  {
    title: 'Dubrovnik: Walking the Old City Walls',
    image:
      'https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=1200&q=80',
    content:
      'Dubrovnik is all stone alleys, sea views, and fortress walls, which makes it a strong example for a travel post with a clear visual story.',
    authorEmail: 'omar.neumann@teaching.local',
  },
  {
    title: 'Gozo, Malta: Quiet Coves and Clear Water',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    content:
      'Gozo is the slower, quieter side of the Maltese islands, with enough blue water and rocky coastline to keep the post visually interesting.',
    authorEmail: 'mia.rossi@teaching.local',
  },
  {
    title: 'Cappadocia at Sunrise: Balloons Over the Valleys',
    image:
      'https://images.unsplash.com/photo-1523618084-5586c1703251?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    content:
      'Cappadocia is the kind of destination that makes a post feel instantly dramatic, especially when the sky fills with hot air balloons at sunrise.',
    authorEmail: 'noah.berg@teaching.local',
  },
  {
    title: 'Aang at Sunrise: Riding the Currents Above the Earth Kingdom',
    image:
      'https://images.unsplash.com/photo-1558015244-af053686b2cd?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    content:
      'Aang feels right in a wide-open sky like this, with the landscape stretching out below him and the morning light doing most of the work.',
    authorEmail: 'aang@air.com',
  },
  {
    title: 'The Southern Air Temple: Quiet Ridges and Open Skies',
    image:
      'https://images.unsplash.com/photo-1770417526693-3aa4df10865b?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    content:
      'This is the kind of calm, expansive scene that fits Aang best: still air, long horizons, and a sense that the next breeze could change everything.',
    authorEmail: 'aang@air.com',
  },
  {
    title: 'Sky Bison Route: Crossing the Valleys Between Nations',
    image:
      'https://images.unsplash.com/photo-1523618084-5586c1703251?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    content:
      'A travel post for the Avatar crew should feel like motion, distance, and a little bit of wonder, which is exactly what this sky-and-stone landscape gives you.',
    authorEmail: 'aang@air.com',
  },
  {
    title: 'Katara at the Northern Water Tribe: Ice, Ceremony, and Discipline',
    image:
      'https://images.unsplash.com/photo-1717656966164-bc72ffcd08f3?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    content:
      'Katara fits a calm, blue shoreline perfectly: controlled, clear, and powerful without needing to be loud about it.',
    authorEmail: 'katara@water.com',
  },
  {
    title: 'Healing Waters: A Quiet Morning by the Frozen Shore',
    image:
      'https://images.unsplash.com/photo-1720742134007-0ad6d058dbc3?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    content:
      'This quieter scene leans into Katara’s healing side, with cold water, still air, and a landscape that feels patient rather than dramatic.',
    authorEmail: 'katara@water.com',
  },
  {
    title: 'Zuko at the Fire Nation Cliffs: Heat, Ash, and Resolve',
    image:
      'https://images.unsplash.com/photo-1721297014981-1015290824aa?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    content:
      'Zuko belongs in a scene with heat and pressure, where the environment feels as intense as the character arc.',
    authorEmail: 'zuko@fire.com',
  },
  {
    title: 'The Ember Camp: Training After Sunset',
    image:
      'https://images.unsplash.com/photo-1632739867170-41aeb7069615?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZpcmUlMjBtb3VudGFpbnxlbnwwfHwwfHx8MA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
    content:
      'A small fire at night suits Zuko well: restrained, focused, and always on the edge of becoming something bigger.',
    authorEmail: 'zuko@fire.com',
  },
];

const main = async () => {
  await mongoose.connect(mongoURI, { dbName });

  try {
    await Promise.all([
      mongoose.connection.collection('refreshtokens').deleteMany({}),
      SeedPost.deleteMany({}),
      SeedUser.deleteMany({}),
    ]);

    const users = (await SeedUser.insertMany(
      await Promise.all(
        seedUsers.map(async (user) => ({
          ...user,
          password: await bcrypt.hash(user.password, 10),
        })),
      ),
    )) as SeededUser[];

    const userByEmail = new Map<string, SeededUser>(users.map((user) => [user.email, user]));

    await SeedPost.insertMany(
      seedPosts.map((post) => {
        const author = userByEmail.get(post.authorEmail);
        if (!author) throw new Error(`Missing author for post: ${post.title}`);

        return {
          title: post.title,
          image: post.image,
          content: post.content,
          author: author._id,
        };
      }),
    );

    console.log(`Seeded ${users.length} users and ${seedPosts.length} posts in ${dbName}`);
    console.log(`Teaching login password for the default seeded users: ${defaultPassword}`);
    console.log(`Aang login password: ${aangPassword}`);
    console.log(`Katara login password: ${kataraPassword}`);
    console.log(`Zuko login password: ${zukoPassword}`);
  } finally {
    await mongoose.disconnect();
  }
};

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exitCode = 1;
});
