import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { StaffInviteJob } from "../queues/types";
import { EmailService } from "../services/email.service";
import { WhatsAppService } from "../services/whatsapp.services";

export const notificationWorker = new Worker(
  'notifications',
  async job => {
    if (job.name === 'staff-invite') {
      const { email, businessName, inviteLink, phone } =
        job.data as StaffInviteJob;
      
      const html = `
        <p>You have been invited to join <strong>${businessName}</strong>.</p>
        <p><a href="${inviteLink}">Accept Invite</a></p>
      `;

      await EmailService.sendEmail(email, `${businessName} Invite`, html);

      if (phone) {
        await WhatsAppService.sendMessage(
          phone,
          `You have been invited to join ${businessName}. Accept here: ${inviteLink}`
        );
      }

      // TODO: integrate email / WhatsApp provider
      console.log(`
        Invite Email:
        Business: ${businessName}
        To: ${email}
        Link: ${inviteLink}
      `);
    }
  },
  { connection: redisConnection }
);

notificationWorker.on('failed', (job, err) => {
  console.error('Notification failed', {
    jobId: job?.id,
    reason: err.message
  });
})