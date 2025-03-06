// src/services/emergency-notification-service.js
import IndexedDBService from '../services/indexedDB-service.js';

class EmergencyNotificationService {
    constructor() {
        this.indexedDBService = new IndexedDBService();
    }

    async notifyEmergencyContacts(fallData) {
        try {
            // Retrieve emergency contacts
            const contacts = await this.indexedDBService.getAllEmergencyContacts();
            
            if (contacts.length === 0) {
                console.warn('No emergency contacts configured');
                return false;
            }

            // Multiple notification methods
            const notificationPromises = contacts.map(contact => 
                this.sendMultiChannelNotification(contact, fallData)
            );

            // Wait for all notifications to be processed
            const results = await Promise.allSettled(notificationPromises);
            
            // Check if at least one notification was successful
            const successfulNotifications = results.some(
                result => result.status === 'fulfilled' && result.value
            );

            return successfulNotifications;
        } catch (error) {
            console.error('Failed to notify emergency contacts:', error);
            return false;
        }
    }

    async sendMultiChannelNotification(contact, fallData) {
        const notificationMethods = [
            this.sendBrowserNotification(contact, fallData),
            this.sendEmailNotification(contact, fallData),
            this.sendSMSNotification(contact, fallData)
        ];

        // Try multiple notification channels
        try {
            const results = await Promise.allSettled(notificationMethods);
            
            // Log which methods succeeded
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    console.log(`Notification method ${index + 1} succeeded`);
                }
            });

            return results.some(result => 
                result.status === 'fulfilled' && result.value
            );
        } catch (error) {
            console.error('Multi-channel notification failed', error);
            return false;
        }
    }

    sendBrowserNotification(contact, fallData) {
        return new Promise((resolve) => {
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(`Fall Detected - ${contact.name}`, {
                    body: `Emergency contact for potential fall at ${new Date().toLocaleString()}`,
                    icon: '/images/emergency-icon.png'
                });
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    // Placeholder for email notification (would require backend integration)
    sendEmailNotification(contact, fallData) {
        return new Promise((resolve) => {
            // In a real-world scenario, this would call a backend email service
            console.log(`Email notification simulated for ${contact.name}`);
            // Simulating partial success
            resolve(Math.random() > 0.5);
        });
    }

    // Placeholder for SMS notification (would require backend integration)
    sendSMSNotification(contact, fallData) {
        return new Promise((resolve) => {
            // In a real-world scenario, this would call a SMS gateway service
            console.log(`SMS notification simulated for ${contact.phone}`);
            // Simulating partial success
            resolve(Math.random() > 0.5);
        });
    }

    // Request notification permission
    requestNotificationPermission() {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted');
                }
            });
        }
    }

    sendEmailNotification(contact, fallData) {
        return new Promise((resolve) => {
            // Include location information in notification
            const locationInfo = fallData.location 
                ? `Location: ${fallData.location.mapLink}` 
                : 'Location not available';
            
            console.log(`Email with fall details and ${locationInfo}`);
            resolve(true);
        });
    }
}

export default EmergencyNotificationService;