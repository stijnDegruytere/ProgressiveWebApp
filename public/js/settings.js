// js/settings.js
import IndexedDBService from '../services/indexedDB-service.js';
import FallDetectionService from '../services/fall-detection-service.js';

class AppSettings {
    constructor() {
        this.indexedDBService = new IndexedDBService();
        this.fallDetectionService = new FallDetectionService();

        this.initForm();
        this.loadCurrentSettings();
    }

    initForm() {
        this.settingsForm = document.getElementById('appSettingsForm');
        this.sensitivitySlider = document.getElementById('fallSensitivity');
        this.sensitivityValue = document.getElementById('sensitivityValue');

        // Sensitivity slider event
        this.sensitivitySlider.addEventListener('input', (e) => {
            this.sensitivityValue.textContent = e.target.value;
        });

        // Form submission handler
        this.settingsForm.addEventListener('submit', this.saveSettings.bind(this));
    }

    async loadCurrentSettings() {
        try {
            // Try to retrieve existing settings
            const settings = await this.indexedDBService.getUserSettings('appSettings');
            
            if (settings) {
                // Populate form with saved settings
                this.sensitivitySlider.value = settings.fallSensitivity || 50;
                this.sensitivityValue.textContent = this.sensitivitySlider.value;

                // Additional settings can be added here
                document.getElementById('enableVibration').checked = settings.enableVibration || true;
                document.getElementById('enableSound').checked = settings.enableSound || true;
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    async saveSettings(event) {
        event.preventDefault();

        // Collect form data
        const settings = {
            key: 'appSettings',
            fallSensitivity: parseInt(this.sensitivitySlider.value),
            enableVibration: document.getElementById('enableVibration').checked,
            enableSound: document.getElementById('enableSound').checked
        };

        try {
            // Save settings to IndexedDB
            await this.indexedDBService.saveUserSettings(settings);

            // Calibrate fall detection service
            this.fallDetectionService.calibrate({
                accelerationThreshold: this.mapSensitivityToThreshold(settings.fallSensitivity)
            });

            // Show success message
            this.showNotification('Settings saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showNotification('Failed to save settings', 'error');
        }
    }

    // Map sensitivity slider (0-100) to acceleration threshold
    mapSensitivityToThreshold(sensitivity) {
        // Example mapping: 
        // Lower sensitivity (closer to 0) = higher threshold (less sensitive)
        // Higher sensitivity (closer to 100) = lower threshold (more sensitive)
        return 5 - (sensitivity / 20);
    }

    showNotification(message, type = 'info') {
        const notificationContainer = document.getElementById('settingsNotification');
        notificationContainer.textContent = message;
        notificationContainer.className = `notification ${type}`;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            notificationContainer.textContent = '';
            notificationContainer.className = 'notification';
        }, 3000);
    }
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AppSettings();
});