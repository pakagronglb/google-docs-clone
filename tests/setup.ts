import { FullConfig } from '@playwright/test';
import { spawn } from 'child_process';

// Store server reference
let server: ReturnType<typeof spawn>;

async function globalSetup(config: FullConfig) {
  if (!process.env.CI) {
    // Start the development server
    server = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    });

    // Wait for the server to be ready
    await new Promise((resolve) => {
      setTimeout(resolve, 5000); // Give the server 5 seconds to start
    });
  }

  // Handle cleanup
  process.on('exit', () => {
    if (server) {
      server.kill('SIGTERM');
    }
  });
}

export default globalSetup; 