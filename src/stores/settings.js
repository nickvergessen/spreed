/**
 * @copyright Copyright (c) 2020 Joas Schilling <coding@schilljs.com>
 *
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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { defineStore } from 'pinia'

import { loadState } from '@nextcloud/initial-state'

import { PRIVACY } from '../constants.js'
import { setReadStatusPrivacy, setTypingStatusPrivacy } from '../services/settingsService.js'

export const useSettingsStore = defineStore('settings', {
	state: () => ({
		readStatusPrivacy: loadState('spreed', 'read_status_privacy', PRIVACY.PRIVATE),
		typingStatusPrivacy: loadState('spreed', 'typing_privacy', PRIVACY.PRIVATE),
	}),

	actions: {
		/**
		 * Update the read status privacy for the user
		 *
		 * @param {number} privacy The new selected privacy
		 */
		async updateReadStatusPrivacy(privacy) {
			await setReadStatusPrivacy(privacy)
			this.readStatusPrivacy = privacy
		},

		/**
		 * Update the typing status privacy for the user
		 *
		 * @param {number} privacy The new selected privacy
		 */
		async updateTypingStatusPrivacy(privacy) {
			await setTypingStatusPrivacy(privacy)
			this.typingStatusPrivacy = privacy
		},
	},
})
