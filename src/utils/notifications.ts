import * as Notifications from 'expo-notifications';
import { Project } from '../types';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

export async function scheduleDeadlineReminder(project: Project): Promise<string | null> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return null;

  const deadlineDate = new Date(project.deadline);
  const reminderDate = new Date(deadlineDate);
  reminderDate.setDate(reminderDate.getDate() - 1); // 1 day before
  reminderDate.setHours(9, 0, 0, 0); // 9:00 AM

  // Don't schedule if the reminder time has already passed
  if (reminderDate.getTime() <= Date.now()) return null;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `⏰ Deadline Tomorrow`,
      body: `"${project.projectTitle}" for ${project.clientName} is due tomorrow!`,
      data: { projectId: project.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
    },
  });

  return id;
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
