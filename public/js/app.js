// js/app.js
import IndexedDBService from '../services/indexedDB-service.js';
import FallDetectionService from '../services/fall-detection-service.js';
import FallConfirmationModal from './fall-confirmation-modal.js';
import EmergencyNotificationService from './emergency-notification-service.js';
import LocationTrackingService from '../services/location-tracking-service.js';

class FallDetectionApp {
    constructor() {
        this.indexedDBService = new IndexedDBService();
        this.fallDetectionService = new FallDetectionService();
        this.emergencyNotificationService = new EmergencyNotificationService();
        this.locationTrackingService = new LocationTrackingService();
        this.locationPermissionModal = document.getElementById('locationPermissionModal');
        
        this.initLocationPermissionModal();
        this.initLocationTracking();
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

    async checkLocationPermission() {
        const permissionResult = await this.locationTrackingService.checkPermissions();
        
        if (permissionResult.status === null) {
            // Show permission request modal
            this.showLocationPermissionModal();
        } else if (permissionResult.status === true) {
            // Start tracking if permission granted
            this.locationTrackingService.startTracking();
        }
    }

    showLocationPermissionModal() {
        this.locationPermissionModal.style.display = 'block';
    }

    closeLocationPermissionModal() {
        this.locationPermissionModal.style.display = 'none';
    }

    async requestLocationPermission() {
        try {
            // Attempt to start tracking (will prompt for permission)
            await this.locationTrackingService.startTracking();
            this.closeLocationPermissionModal();
        } catch (error) {
            console.error('Location permission denied:', error);
            // Optionally show a more detailed error message
            alert('Location access is crucial for emergency detection. Please enable in device settings.');
        }
    }

    // Modify existing initialization
    initLocationTracking() {
        this.checkLocationPermission();
    }

    initLocationPermissionModal() {
        const allowLocationBtn = document.getElementById('allowLocationBtn');
        const denyLocationBtn = document.getElementById('denyLocationBtn');

        allowLocationBtn.addEventListener('click', () => {
            this.requestLocationPermission();
        });

        denyLocationBtn.addEventListener('click', () => {
            this.closeLocationPermissionModal();
        });
    }

    // ... previous methods remain the same ...

    initFallDetection() {
        const isSupported = this.fallDetectionService.startMonitoring();
        
        if (isSupported) {
            this.fallDetectionService.onFallDetected(async (fallData) => {
                // Log the fall event with more detailed information
                await this.indexedDBService.logFallEvent({
                    ...fallData,
                    detectionMethod: 'Advanced Algorithm',
                    confidence: 'High' // You can add confidence levels
                });
                
                // Trigger fall confirmation process
                this.handlePotentialFall(fallData);
            });
        } else {
            // Show a warning if fall detection is not supported
            console.warn('Fall detection not supported on this device');
            // Optional: Show user a message about device compatibility
        }
    }

    requestNotificationPermissions() {
        this.emergencyNotificationService.requestNotificationPermission();
    }

    handlePotentialFall(fallData) {
        // Create modal with confirmation handlers
        const location = this.locationTrackingService.getCurrentLocation();
        if (location) {
            fallData.location = {
                ...location,
                mapLink: this.locationTrackingService.generateMapLink(location)
            };
        }

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

    initLocationTracking() {
        // Request location permissions on app start
        this.locationTrackingService.checkPermissions()
            .then((result) => {
                if (result.status === true) {
                    this.locationTrackingService.startTracking();
                } else {
                    console.warn(result.message);
                }
            });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FallDetectionApp();
});