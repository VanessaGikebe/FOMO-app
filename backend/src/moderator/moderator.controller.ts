import { Controller, Get, Logger, Res, HttpStatus } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Response } from 'express';

@Controller('moderator')
export class ModeratorController {
	private readonly logger = new Logger(ModeratorController.name);

	/**
	 * GET /moderator/organisers
	 * Returns a list of users with role 'organizer' or 'organiser'
	 */
	@Get('organisers')
	async getOrganisers(@Res() res: Response) {
		try {
			const db = admin.firestore();
			// allow both spellings just in case some docs used 'organiser'
			const snapshot = await db
				.collection('users')
				.where('role', 'in', ['organizer', 'organiser'])
				.get();

			const organisers = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }));
			return res.status(HttpStatus.OK).json(organisers);
		} catch (err) {
			// Log full error server-side and return details for debugging
			this.logger.error('Failed to fetch organisers', err as any);
			const message = err && (err as any).message ? (err as any).message : 'Unknown server error';
			const stack = err && (err as any).stack ? (err as any).stack : null;
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: message, stack });
		}
	}
}
