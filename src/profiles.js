/**
 * Profile Manager
 * Handles loading and managing prompt profiles
 */

const DEFAULT_PROFILES = {
    beginner_default: {
        name: "Beginner Default",
        verbosity: "medium",
        structure: ["Summary", "Implementation", "Notes"],
        tone: "clear, patient, instructional",
        assumptions: "Assume modern language versions and common tooling"
    }
};

export class ProfileManager {
    constructor() {
        this.profiles = { ...DEFAULT_PROFILES };
        this.currentProfileId = 'beginner_default';
    }

    /**
     * Get all available profiles
     * @returns {Object} map of profile objects
     */
    getProfiles() {
        return this.profiles;
    }

    /**
     * Get the currently active profile
     * @returns {Object} profile object
     */
    getCurrentProfile() {
        return this.profiles[this.currentProfileId] || this.profiles['beginner_default'];
    }

    /**
     * Set the active profile
     * @param {string} profileId 
     */
    setProfile(profileId) {
        if (this.profiles[profileId]) {
            this.currentProfileId = profileId;
        }
    }

    /**
     * Get a specific profile by ID
     * @param {string} profileId 
     * @returns {Object} profile object
     */
    getProfile(profileId) {
        return this.profiles[profileId];
    }
}

// Singleton instance
export const profileManager = new ProfileManager();
