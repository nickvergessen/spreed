/**
 * @copyright Copyright (c) 2019 Joas Schilling <coding@schilljs.com>
 *
 * @author Joas Schilling <coding@schilljs.com>
 * @author Maksim Sukharev <antreesy.web@gmail.com>
 *
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

/**
 * This store helps to identify the current actor in all cases.
 * In Talk not every user is a local nextcloud user, so identifying
 * solely by userId is not enough.
 * If an as no userId, they are a guest and identified by actorType + sessionId.
 */

import { defineStore } from 'pinia'

import { ATTENDEE, PARTICIPANT } from '../constants.js'

export const useActorStore = defineStore('actorStore', {
	state: () => ({
		userId: null,
		sessionId: null,
		attendeeId: null,
		actorId: null,
		actorType: null,
		displayName: '',
	}),

	getters: {
		actorIsGuest: (state) => {
			return state.userId === null && state.actorType === ATTENDEE.ACTOR_TYPE.GUESTS
		},

		getParticipantIdentifier: (state) => () => {
			return {
				attendeeId: state.attendeeId,
				actorType: state.actorType,
				actorId: state.actorId,
				sessionId: state.sessionId,
			}
		},
	},

	actions: {
		/**
		 * Set the userId
		 *
		 * @param {string|null} userId The user id
		 */
		setUserId(userId) {
			this.userId = userId
			this.actorId = userId
		},

		/**
		 * Set the displayName only (for guest names).
		 *
		 * @param {string} displayName the display name to be set;
		 */
		setDisplayName(displayName) {
			this.displayName = displayName
		},

		/**
		 * Set the actor from the current user
		 *
		 * @param {object} user A NextcloudUser object as returned by @nextcloud/auth
		 * @param {string} user.uid The user id of the user
		 * @param {string|null} user.displayName The display name of the user
		 */
		setCurrentUser(user) {
			this.setUserId(user.uid)
			this.displayName = user.displayName || user.uid
			this.actorType = 'users'
		},

		/**
		 * Set the actor from the current participant
		 *
		 * @param {object} participant The participant data
		 * @param {number} participant.attendeeId The attendee id of the participant
		 * @param {number} participant.participantType The type of the participant
		 * @param {string} participant.sessionId The session id of the participant
		 * @param {string} participant.actorId The actor id of the participant
		 */
		setCurrentParticipant(participant) {
			this.sessionId = participant.sessionId
			this.attendeeId = participant.attendeeId

			if (participant.participantType === PARTICIPANT.TYPE.GUEST
				|| participant.participantType === PARTICIPANT.TYPE.GUEST_MODERATOR) {
				this.setUserId(null)
				this.actorType = 'guests'
				this.actorId = participant.actorId
			}
		},
	},
})
