// js/app.js
import IndexedDBService from '../services/indexedDB-service.js';
import FallDetectionService from '../services/fall-detection-service.js';
import FallConfirmationModal from './fall-confirmation-modal.js';
import EmergencyNotificationService from './emergency-notification-service.js';

class FallDetectionApp {
    constructor() {
        this.indexedDBService = new IndexedDBService();
        this.fallDetectionService = new FallDetectionService();
        this.emergencyNotificationService = new EmergencyNotificationService();

        this.initNavigation();
        this.initFallDetection();
        this.requestNotificationPermissions();
    }

    initNavigation() {
        const navButtons = {
            homeNav: 'homeView',
            contactsNav: 'contactsView',
            settingsNav: 'settingsView'
        };

        Object.entries(navButtons).forEach(([buttonId, viewId]) => {
            const button = document.getElementById(buttonId);
            const view = document.getElementById(viewId);

            button.addEventListener('click', () => {
                // Hide all views
                document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
                
                // Show selected view
                view.style.display = 'block';
            });
        });
    }

    // ... previous methods remain the same ...

    initFallDetection() {
        const isSupported = this.fallDetectionService.startMonitoring();
        
        if (isSupported) {
            this.fallDetectionService.onFallDetected(async (fallData) => {
                await this.indexedDBService.logFallEvent(fallData);
                this.handlePotentialFall(fallData);
            });
        }
    }

    requestNotificationPermissions() {
        this.emergencyNotificationService.requestNotificationPermission();
    }

    handlePotentialFall(fallData) {
        // Create modal with confirmation handlers
        const fallConfirmationModal = new FallConfirmationModal(
            // User confirms they are safe
            () => {
                console.log('User is safe');
                // Additional safe handling if needed
            },
            // User needs help or doesn't respond
            async () => {
                console.log('Sending emergency notifications');
                const notificationSent = await this.emergencyNotificationService.notifyEmergencyContacts(fallData);
                
                if (notificationSent) {
                    // Optional: Trigger additional emergency protocols
                    this.triggerEmergencyAlarm();
                }
            }
        );

        // Show the confirmation modal
        fallConfirmationModal.show();
    }

    triggerEmergencyAlarm() {
        // Simulate emergency alarm
        // In a mobile app, this would use device vibration and sound
        if ('vibrate' in navigator) {
            // Vibration pattern: 500ms vibration, 250ms pause, repeat 3 times
            navigator.vibrate([500, 250, 500, 250, 500, 250]);
        }

        // Optional: Play an alarm sound
        const audio = new Audio('/sounds/emergency-alarm.mp3');
        audio.play();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FallDetectionApp();
});