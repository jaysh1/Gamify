import { checkAndResetStreaks } from './streakService';

export function startCronJobs(): void {
  const MIDNIGHT_CHECK_INTERVAL = 60 * 60 * 1000;

  setInterval(async () => {
    const now = new Date();
    
    if (now.getHours() === 0 && now.getMinutes() < 60) {
      console.log('Running daily streak check...');
      try {
        await checkAndResetStreaks();
        console.log('Daily streak check completed successfully');
      } catch (error) {
        console.error('Error running daily streak check:', error);
      }
    }
  }, MIDNIGHT_CHECK_INTERVAL);

  console.log('Cron jobs initialized');
}
