import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class ModeratorService {
  private readonly logger = new Logger(ModeratorService.name);
  private readonly db = admin.firestore();

  /**
   * Flag an event for review
   * @param eventId - Event ID to flag
   * @param reason - Reason for flagging
   * @param moderatorId - ID of the moderator flagging
   */
  async flagEvent(eventId: string, reason: string, moderatorId: string) {
    try {
      if (!eventId || !reason || !moderatorId) {
        throw new BadRequestException('eventId, reason, and moderatorId are required');
      }

      // Verify event exists
      const eventDoc = await this.db.collection('events').doc(eventId).get();
      if (!eventDoc.exists) {
        throw new NotFoundException(`Event with ID ${eventId} not found`);
      }

      const timestamp = admin.firestore.Timestamp.now();

      // Update event with flag information
      await this.db.collection('events').doc(eventId).update({
        isFlagged: true,
        flagReason: reason,
        flaggedBy: moderatorId,
        flaggedAt: timestamp,
      });

      // Log the moderation action
      await this.db.collection('moderatorLogs').add({
        action: 'FLAG_EVENT',
        eventId,
        moderatorId,
        reason,
        timestamp,
      });

      this.logger.log(`Event ${eventId} flagged by moderator ${moderatorId}`);
      return { success: true, message: `Event flagged successfully` };
    } catch (err) {
      this.logger.error(`Failed to flag event: ${err.message}`, err);
      throw err;
    }
  }

  /**
   * Unflag an event (remove flag)
   * @param eventId - Event ID to unflag
   * @param moderatorId - ID of the moderator unflagging
   */
  async unflagEvent(eventId: string, moderatorId: string) {
    try {
      if (!eventId || !moderatorId) {
        throw new BadRequestException('eventId and moderatorId are required');
      }

      // Verify event exists and is flagged
      const eventDoc = await this.db.collection('events').doc(eventId).get();
      if (!eventDoc.exists) {
        throw new NotFoundException(`Event with ID ${eventId} not found`);
      }

      const eventData = eventDoc.data();
      if (!eventData?.isFlagged) {
        throw new BadRequestException('Event is not flagged');
      }

      const timestamp = admin.firestore.Timestamp.now();

      // Update event to remove flag
      await this.db.collection('events').doc(eventId).update({
        isFlagged: false,
        flagReason: null,
        flaggedBy: null,
        flaggedAt: null,
        unflaggedBy: moderatorId,
        unflaggedAt: timestamp,
      });

      // Log the moderation action
      await this.db.collection('moderatorLogs').add({
        action: 'UNFLAG_EVENT',
        eventId,
        moderatorId,
        timestamp,
      });

      this.logger.log(`Event ${eventId} unflagged by moderator ${moderatorId}`);
      return { success: true, message: `Event unflagged successfully` };
    } catch (err) {
      this.logger.error(`Failed to unflag event: ${err.message}`, err);
      throw err;
    }
  }

  /**
   * Delete a flagged event
   * @param eventId - Event ID to delete
   * @param moderatorId - ID of the moderator deleting
   */
  async deleteEvent(eventId: string, moderatorId: string) {
    try {
      if (!eventId || !moderatorId) {
        throw new BadRequestException('eventId and moderatorId are required');
      }

      // Verify event exists and is flagged
      const eventDoc = await this.db.collection('events').doc(eventId).get();
      if (!eventDoc.exists) {
        throw new NotFoundException(`Event with ID ${eventId} not found`);
      }

      const eventData = eventDoc.data();
      if (!eventData?.isFlagged) {
        throw new BadRequestException('Only flagged events can be deleted');
      }

      const timestamp = admin.firestore.Timestamp.now();

      // Store archive record before deleting
      await this.db.collection('deletedEvents').add({
        ...eventData,
        eventId,
        deletedBy: moderatorId,
        deletedAt: timestamp,
        deletionReason: eventData.flagReason,
      });

      // Delete the event
      await this.db.collection('events').doc(eventId).delete();

      // Log the moderation action
      await this.db.collection('moderatorLogs').add({
        action: 'DELETE_EVENT',
        eventId,
        moderatorId,
        reason: eventData.flagReason,
        timestamp,
      });

      this.logger.log(`Event ${eventId} deleted by moderator ${moderatorId}`);
      return { success: true, message: `Event deleted successfully` };
    } catch (err) {
      this.logger.error(`Failed to delete event: ${err.message}`, err);
      throw err;
    }
  }

  /**
   * Flag a user (organiser) for review
   * @param userId - User ID to flag
   * @param reason - Reason for flagging
   * @param moderatorId - Moderator performing the action
   */
  async flagUser(userId: string, reason: string, moderatorId: string) {
    try {
      if (!userId || !reason || !moderatorId) {
        throw new BadRequestException('userId, reason, and moderatorId are required');
      }

      let userDocRef = this.db.collection('users').doc(userId);
      let userDoc = await userDocRef.get();
      // Fallback: if not found by doc id, try to lookup by email when an email-like value was passed
      if (!userDoc.exists) {
        if (typeof userId === 'string' && userId.includes('@')) {
          const q = await this.db.collection('users').where('email', '==', userId).limit(1).get();
          if (!q.empty) {
            userDoc = q.docs[0];
            userDocRef = this.db.collection('users').doc(userDoc.id);
            // normalize userDoc to a DocumentSnapshot-like shape
            userDoc = await userDocRef.get();
          }
        }
      }

      if (!userDoc.exists) {
        throw new NotFoundException(`User with ID or email ${userId} not found`);
      }

      const timestamp = admin.firestore.Timestamp.now();

      await userDocRef.update({
        isFlagged: true,
        flagReason: reason,
        flaggedBy: moderatorId,
        flaggedAt: timestamp,
      });

      // Log the moderation action
      await this.db.collection('moderatorLogs').add({
        action: 'FLAG_USER',
        userId,
        moderatorId,
        reason,
        timestamp,
      });

      this.logger.log(`User ${userId} flagged by moderator ${moderatorId}`);
      return { success: true, message: `User flagged successfully` };
    } catch (err) {
      this.logger.error(`Failed to flag user: ${err.message}`, err);
      throw err;
    }
  }

  /**
   * Unflag a user
   * @param userId - User ID to unflag
   * @param moderatorId - Moderator performing the action
   */
  async unflagUser(userId: string, moderatorId: string) {
    try {
      if (!userId || !moderatorId) {
        throw new BadRequestException('userId and moderatorId are required');
      }

      let userDocRef = this.db.collection('users').doc(userId);
      let userDoc = await userDocRef.get();
      if (!userDoc.exists) {
        if (typeof userId === 'string' && userId.includes('@')) {
          const q = await this.db.collection('users').where('email', '==', userId).limit(1).get();
          if (!q.empty) {
            userDoc = q.docs[0];
            userDocRef = this.db.collection('users').doc(userDoc.id);
            userDoc = await userDocRef.get();
          }
        }
      }

      if (!userDoc.exists) {
        throw new NotFoundException(`User with ID or email ${userId} not found`);
      }

      const userData = userDoc.data();
      if (!userData?.isFlagged) {
        throw new BadRequestException('User is not flagged');
      }

      const timestamp = admin.firestore.Timestamp.now();

      await userDocRef.update({
        isFlagged: false,
        flagReason: null,
        flaggedBy: null,
        flaggedAt: null,
        unflaggedBy: moderatorId,
        unflaggedAt: timestamp,
      });

      // Log the moderation action
      await this.db.collection('moderatorLogs').add({
        action: 'UNFLAG_USER',
        userId,
        moderatorId,
        timestamp,
      });

      this.logger.log(`User ${userId} unflagged by moderator ${moderatorId}`);
      return { success: true, message: `User unflagged successfully` };
    } catch (err) {
      this.logger.error(`Failed to unflag user: ${err.message}`, err);
      throw err;
    }
  }

  /**
   * Remove (delete) a user after moderation action
   * - Archives the user doc into `removedUsers`
   * - Deletes the user doc from `users`
   * - Attempts to delete the Firebase Auth user if a uid is available
   * - Writes a moderatorLogs entry with action 'REMOVE_USER'
   */
  async removeUser(userId: string, reason: string, moderatorId: string) {
    try {
      if (!userId || !moderatorId) {
        throw new BadRequestException('userId and moderatorId are required');
      }

      let userDocRef = this.db.collection('users').doc(userId);
      let userDoc = await userDocRef.get();

      // Fallback: if not found by id, try lookup by email
      if (!userDoc.exists) {
        if (typeof userId === 'string' && userId.includes('@')) {
          const q = await this.db.collection('users').where('email', '==', userId).limit(1).get();
          if (!q.empty) {
            userDoc = q.docs[0];
            userDocRef = this.db.collection('users').doc(userDoc.id);
            userDoc = await userDocRef.get();
          }
        }
      }

      if (!userDoc.exists) {
        throw new NotFoundException(`User with ID or email ${userId} not found`);
      }

      const userData = userDoc.data() || {};
      const timestamp = admin.firestore.Timestamp.now();

      // Archive into removedUsers collection
      await this.db.collection('removedUsers').add({
        originalId: userDocRef.id,
        archivedAt: timestamp,
        archivedBy: moderatorId,
        reason: reason || null,
        user: userData,
      });

      // Delete user doc
      await userDocRef.delete();

      // Try to delete Firebase Auth account if uid present
      const possibleUid = userData.uid || userDocRef.id;
      try {
        if (possibleUid) {
          // Only attempt if looks like a Firebase uid (basic length check)
          if (typeof possibleUid === 'string' && possibleUid.length >= 20) {
            await admin.auth().deleteUser(possibleUid).catch((e) => {
              // Log but don't fail the whole operation if auth delete fails
              this.logger.warn(`Failed to delete Firebase Auth user ${possibleUid}: ${e?.message || e}`);
            });
          }
        }
      } catch (e) {
        this.logger.warn('Error while attempting to remove auth user', e?.message || e);
      }

      // Log the moderation action
      await this.db.collection('moderatorLogs').add({
        action: 'REMOVE_USER',
        userId: userDocRef.id,
        moderatorId,
        reason: reason || null,
        timestamp,
      });

      this.logger.log(`User ${userDocRef.id} removed by moderator ${moderatorId}`);
      return { success: true, message: 'User removed successfully' };
    } catch (err) {
      this.logger.error(`Failed to remove user: ${err.message}`, err);
      throw err;
    }
  }

  /**
   * Get all flagged events
   */
  async getFlaggedEvents() {
    try {
      const snapshot = await this.db
        .collection('events')
        .where('isFlagged', '==', true)
        .get();

      const flaggedEvents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return flaggedEvents;
    } catch (err) {
      this.logger.error(`Failed to get flagged events: ${err.message}`, err);
      throw err;
    }
  }

  /**
   * Get moderation logs
   * @param limit - Max number of logs to return (default 100)
   */
  async getModerationLogs(limit: number = 100) {
    try {
      const snapshot = await this.db
        .collection('moderatorLogs')
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      const logs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return logs;
    } catch (err) {
      this.logger.error(`Failed to get moderation logs: ${err.message}`, err);
      throw err;
    }
  }

  /**
   * Get all organizers
   */
  async getOrganizers() {
    try {
      const roleVariants = [
        'Event Organiser',
        'Event Organizer',
        'organiser',
        'organizer',
        'event organiser',
        'event organizer',
      ];

      const snapshot = await this.db
        .collection('users')
        .where('role', 'in', roleVariants)
        .get();

      const organizers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return organizers;
    } catch (err) {
      this.logger.error(`Failed to get organizers: ${err.message}`, err);
      throw err;
    }
  }
}
