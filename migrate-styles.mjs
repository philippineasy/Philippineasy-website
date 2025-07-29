import fs from 'fs/promises';
import path from 'path';

const colorMappings = {
  // Blues to Primary
  'text-blue-800': 'text-primary/90',
  'text-blue-700': 'text-primary/90',
  'text-blue-600': 'text-primary',
  'text-blue-500': 'text-primary',
  'bg-blue-700': 'bg-primary/90',
  'bg-blue-600': 'bg-primary',
  'bg-blue-100': 'bg-primary/10',
  'bg-blue-50': 'bg-primary/10',
  'border-blue-200': 'border-primary/20',
  'border-blue-300': 'border-primary/40',
  'border-blue-400': 'border-primary/60',
  'border-blue-500': 'border-primary',
  'ring-blue-500': 'ring-ring',
  'focus:border-blue-500': 'focus:border-primary',
  'focus:ring-blue-500': 'focus:ring-ring',
  
  // Indigos (often used with blue)
  'to-indigo-100': 'to-secondary',
  'focus:border-indigo-300': 'focus:border-primary',
  'focus:ring-indigo-200': 'focus:ring-ring',

  // Grays to Foreground/Muted/Border
  'text-gray-400': 'text-muted-foreground',
  'text-gray-500': 'text-muted-foreground',
  'text-gray-600': 'text-muted-foreground',
  'text-gray-700': 'text-foreground',
  'text-gray-800': 'text-foreground',
  'bg-gray-50': 'bg-muted',
  'bg-gray-100': 'bg-muted',
  'bg-gray-200': 'bg-muted/80',
  'bg-gray-800': 'bg-neutral-800', // Assuming a dark variant for overlays
  'border-gray-100': 'border-border',
  'border-gray-200': 'border-border',
  'border-gray-300': 'border-border',

  // Reds to Destructive
  'text-red-500': 'text-destructive',
  'text-red-600': 'text-destructive',
  'text-red-700': 'text-destructive/90',
  'bg-red-500': 'bg-destructive',
  'bg-red-600': 'bg-destructive',
  'hover:bg-red-700': 'hover:bg-destructive/90',

  // Yellows to Accent
  'text-yellow-300': 'text-accent/80',
  'text-yellow-400': 'text-accent/90',
  'text-yellow-500': 'text-accent',
  'bg-yellow-500': 'bg-accent',
  'hover:bg-yellow-600': 'hover:bg-accent/90',
  'border-yellow-200': 'border-accent/20',

  // Greens (Special case, often for success states, but let's map the common one)
  'text-green-500': 'text-green-500', // No change, as it's a specific state color
  'bg-green-500': 'bg-green-500',
  'hover:bg-green-600': 'hover:bg-green-600',
  
  // Whites and Blacks
  'bg-white': 'bg-card',
  'text-white': 'text-card-foreground', // Careful with this one, might need context
  'text-black': 'text-foreground',
};

// A more robust regex to avoid replacing parts of longer class names
const classBoundary = (className) => `([\\s'":])(${className})([\\s'":])`;

async function* getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      // Exclude node_modules and .next directories
      if (dirent.name !== 'node_modules' && dirent.name !== '.next') {
        yield* getFiles(res);
      }
    } else {
      if (res.endsWith('.tsx') || res.endsWith('.ts')) {
        yield res;
      }
    }
  }
}

async function processFiles() {
  console.log('Starting style migration...');
  let filesChanged = 0;

  for await (const file of getFiles('./src')) {
    try {
      let content = await fs.readFile(file, 'utf8');
      let originalContent = content;

      for (const [oldClass, newClass] of Object.entries(colorMappings)) {
        // Use a regex to ensure we are replacing whole classes
        const regex = new RegExp(classBoundary(oldClass), 'g');
        content = content.replace(regex, `$1${newClass}$3`);
      }

      if (content !== originalContent) {
        await fs.writeFile(file, content, 'utf8');
        console.log(`Updated styles in: ${file}`);
        filesChanged++;
      }
    } catch (error) {
      console.error(`Could not process file ${file}:`, error);
    }
  }

  console.log(`\nMigration complete. ${filesChanged} file(s) updated.`);
  if (filesChanged > 0) {
    console.log("Please review the changes and test the application thoroughly.");
  } else {
    console.log("No files needed updating.");
  }
}

processFiles();
