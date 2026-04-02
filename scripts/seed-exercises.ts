import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: 'Chest', sortOrder: 1 },
  { name: 'Back', sortOrder: 2 },
  { name: 'Legs', sortOrder: 3 },
  { name: 'Shoulders', sortOrder: 4 },
  { name: 'Arms', sortOrder: 5 },
  { name: 'Core', sortOrder: 6 },
  { name: 'Cardio', sortOrder: 7 },
];

const EXERCISES: Record<string, { name: string; description: string }[]> = {
  Chest: [
    { name: 'Barbell Bench Press', description: 'Lie flat on bench, grip barbell slightly wider than shoulders, lower to chest and press up explosively.' },
    { name: 'Incline Dumbbell Press', description: 'Set bench to 30-45 degrees, press dumbbells from shoulder level to full arm extension overhead.' },
    { name: 'Dumbbell Flyes', description: 'Lie flat, hold dumbbells above chest with slight elbow bend, lower arms out wide in an arc, then squeeze back together.' },
    { name: 'Cable Crossover', description: 'Stand between cable columns set high, step forward, pull handles down and together in a hugging motion.' },
    { name: 'Push-Ups', description: 'Hands shoulder-width apart, lower body until chest nearly touches floor, push back up keeping core tight.' },
    { name: 'Chest Dips', description: 'Lean forward on parallel bars, lower body by bending elbows until stretch in chest, press back up.' },
  ],
  Back: [
    { name: 'Deadlift', description: 'Stand over barbell, hinge at hips, grip bar and drive through heels to stand tall. Keep back flat throughout.' },
    { name: 'Pull-Ups', description: 'Hang from bar with overhand grip, pull body up until chin clears the bar, lower with control.' },
    { name: 'Barbell Bent-Over Row', description: 'Hinge forward at hips, pull barbell from hanging position to lower chest, squeeze shoulder blades together.' },
    { name: 'Seated Cable Row', description: 'Sit at cable station, pull handle to lower chest keeping torso upright, squeeze back muscles.' },
    { name: 'Lat Pulldown', description: 'Sit at pulldown machine, grip wide bar and pull to upper chest while leaning slightly back.' },
    { name: 'Single-Arm Dumbbell Row', description: 'Place one knee and hand on bench, row dumbbell from floor to hip with opposite arm.' },
  ],
  Legs: [
    { name: 'Barbell Back Squat', description: 'Bar on upper back, feet shoulder-width, sit hips back and down until thighs are parallel, drive up.' },
    { name: 'Leg Press', description: 'Sit in leg press machine, place feet shoulder-width on platform, lower until knees reach 90 degrees, press back.' },
    { name: 'Romanian Deadlift', description: 'Hold barbell at hips, push hips back with slight knee bend, lower bar along legs until hamstring stretch, return.' },
    { name: 'Walking Lunges', description: 'Step forward into a lunge, lower back knee toward floor, push off front foot and step into next lunge.' },
    { name: 'Leg Curl', description: 'Lie face down on leg curl machine, curl heels toward glutes, squeeze hamstrings at top, lower slowly.' },
    { name: 'Leg Extension', description: 'Sit in leg extension machine, extend legs until straight, squeeze quads at top, lower with control.' },
    { name: 'Calf Raises', description: 'Stand on edge of step, raise up on toes squeezing calves, lower heels below step level for full stretch.' },
  ],
  Shoulders: [
    { name: 'Overhead Press', description: 'Stand with barbell at shoulder height, press overhead to full lockout, lower back to shoulders with control.' },
    { name: 'Lateral Raises', description: 'Stand holding dumbbells at sides, raise arms out to sides until parallel with floor, lower slowly.' },
    { name: 'Front Raises', description: 'Hold dumbbells in front of thighs, raise one or both arms forward to shoulder height, lower with control.' },
    { name: 'Face Pulls', description: 'Set cable at face height with rope, pull toward face spreading rope ends apart, squeeze rear delts.' },
    { name: 'Arnold Press', description: 'Start with dumbbells at shoulders palms facing you, rotate palms forward as you press overhead.' },
    { name: 'Reverse Pec Deck', description: 'Sit facing the pec deck pad, grip handles and open arms wide squeezing rear delts together.' },
  ],
  Arms: [
    { name: 'Barbell Curl', description: 'Stand holding barbell with underhand grip, curl to shoulders keeping elbows at sides, lower slowly.' },
    { name: 'Tricep Pushdown', description: 'Stand at cable station, push rope or bar down until arms are straight, squeeze triceps, return slowly.' },
    { name: 'Hammer Curls', description: 'Hold dumbbells with neutral grip (palms facing each other), curl to shoulders, lower with control.' },
    { name: 'Skull Crushers', description: 'Lie on bench holding barbell or EZ bar, lower weight toward forehead by bending elbows, extend back up.' },
    { name: 'Preacher Curl', description: 'Sit at preacher bench, rest upper arms on pad, curl barbell or dumbbells up, lower slowly with full stretch.' },
    { name: 'Overhead Tricep Extension', description: 'Hold dumbbell overhead with both hands, lower behind head by bending elbows, press back to full extension.' },
  ],
  Core: [
    { name: 'Plank', description: 'Hold push-up position on forearms, keep body in straight line from head to heels, engage core throughout.' },
    { name: 'Hanging Leg Raise', description: 'Hang from pull-up bar, raise legs until parallel to floor or higher, lower with control.' },
    { name: 'Cable Woodchop', description: 'Stand sideways to cable set high, pull handle diagonally across body from high to low, rotating torso.' },
    { name: 'Ab Wheel Rollout', description: 'Kneel holding ab wheel, roll forward extending body, maintain tight core, pull back to starting position.' },
    { name: 'Russian Twist', description: 'Sit with knees bent, lean back slightly, rotate torso side to side holding weight or medicine ball.' },
    { name: 'Dead Bug', description: 'Lie on back with arms up and knees at 90 degrees, extend opposite arm and leg, return and alternate.' },
  ],
  Cardio: [
    { name: 'Treadmill Run', description: 'Run at moderate to high intensity on treadmill, maintain good posture and consistent stride.' },
    { name: 'Rowing Machine', description: 'Sit on rower, drive with legs first then lean back and pull handle to chest, return in reverse order.' },
    { name: 'Jump Rope', description: 'Skip rope with quick wrist rotations, stay on balls of feet, keep jumps low and consistent.' },
    { name: 'Battle Ropes', description: 'Hold rope ends, create waves by alternating arms up and down rapidly, keep core engaged.' },
    { name: 'Stairmaster', description: 'Step continuously on stair machine, maintain upright posture, avoid leaning on handrails.' },
    { name: 'Cycling (Stationary)', description: 'Ride stationary bike at varied resistance and speed, maintain proper seat height and posture.' },
  ],
};

async function main() {
  console.log('Seeding exercise library...\n');

  const adminExists = await prisma.user.findUnique({ where: { email: 'admin@builtathletics.com' } });
  if (!adminExists) {
    const hash = await bcrypt.hash('Admin123!', 12);
    await prisma.user.create({
      data: {
        email: 'admin@builtathletics.com',
        passwordHash: hash,
        firstName: 'Admin',
        lastName: 'User',
        isTrainer: true,
      },
    });
    console.log('Created admin user: admin@builtathletics.com');
  } else {
    console.log('Admin user already exists');
  }

  for (const cat of CATEGORIES) {
    const existing = await prisma.category.findFirst({ where: { name: cat.name } });
    let categoryId: string;

    if (existing) {
      categoryId = existing.id;
      console.log(`Category "${cat.name}" already exists (${categoryId})`);
    } else {
      const created = await prisma.category.create({
        data: { name: cat.name, sortOrder: cat.sortOrder, status: 'active' },
      });
      categoryId = created.id;
      console.log(`Created category "${cat.name}" (${categoryId})`);
    }

    const exercises = EXERCISES[cat.name] ?? [];
    for (const ex of exercises) {
      const existingEx = await prisma.exercise.findFirst({
        where: { name: ex.name, categoryId },
      });

      if (existingEx) {
        console.log(`  - "${ex.name}" already exists`);
      } else {
        await prisma.exercise.create({
          data: {
            name: ex.name,
            description: ex.description,
            categoryId,
            status: 'active',
          },
        });
        console.log(`  + Created "${ex.name}"`);
      }
    }
  }

  const totalExercises = await prisma.exercise.count({ where: { status: 'active' } });
  const totalCategories = await prisma.category.count({ where: { status: 'active' } });
  console.log(`\nDone! ${totalCategories} categories, ${totalExercises} exercises.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
