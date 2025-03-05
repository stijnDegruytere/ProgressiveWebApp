// js/emergency-notification-service.js
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

            // In a real-world scenario, you'd use a backend service to send SMS or push notifications
            // For this example, we'll simulate notification
            contacts.forEach(contact => {
                this.simulateNotification(contact, fallData);
            });

            return true;
        } catch (error) {
            console.error('Failed to notify emergency contacts:', error);
            return false;
        }
    }

    simulateNotification(contact, fallData) {
        // This is a simulation. In a real app, you'd integrate with SMS or push notification service
        console.log(`Emergency Notification Sent to ${contact.name}`);
        console.log(`Phone: ${contact.phone}`);
        console.log(`Fall Details: ${JSON.stringify(fallData)}`);

        // Optional: You could add a browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Fall Detected - ${contact.name}`, {
                body: `Emergency contact for potential fall at ${new Date().toLocaleString()}`,
                icon: '/images/emergency-icon.png'
            });
        }
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
}

export default EmergencyNotificationService;