class IndexedDBService {
    constructor(dbName = 'FallDetectionDB', version = 1) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
    }

    // Open or create database
    async openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Emergency Contacts Store
                if (!db.objectStoreNames.contains('emergencyContacts')) {
                    db.createObjectStore('emergencyContacts', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                }

                // User Settings Store
                if (!db.objectStoreNames.contains('userSettings')) {
                    db.createObjectStore('userSettings', { keyPath: 'key' });
                }

                // Fall Detection Logs Store
                if (!db.objectStoreNames.contains('fallLogs')) {
                    db.createObjectStore('fallLogs', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onerror = (event) => {
                reject(`IndexedDB error: ${event.target.error}`);
            };
        });
    }

    // Add emergency contact
    async addEmergencyContact(contact) {
        await this.openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['emergencyContacts'], 'readwrite');
            const store = transaction.objectStore('emergencyContacts');
            const request = store.add(contact);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Get all emergency contacts
    async getAllEmergencyContacts() {
        await this.openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['emergencyContacts'], 'readonly');
            const store = transaction.objectStore('emergencyContacts');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Save user settings
    async saveUserSettings(settings) {
        await this.openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['userSettings'], 'readwrite');
            const store = transaction.objectStore('userSettings');
            const request = store.put(settings);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Get user settings
    async getUserSettings(key) {
        await this.openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['userSettings'], 'readonly');
            const store = transaction.objectStore('userSettings');
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Log fall event
    async logFallEvent(fallData) {
        await this.openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['fallLogs'], 'readwrite');
            const store = transaction.objectStore('fallLogs');
            
            // Enhanced fall log with location details
            const enhancedFallLog = {
                ...fallData,
                timestamp: new Date().toISOString(),
                location: fallData.location ? {
                    latitude: fallData.location.latitude,
                    longitude: fallData.location.longitude,
                    accuracy: fallData.location.accuracy,
                    mapLink: fallData.location.mapLink
                } : null
            };

            const request = store.add(enhancedFallLog);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllFallLogs() {
        await this.openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['fallLogs'], 'readonly');
            const store = transaction.objectStore('fallLogs');
            const request = store.getAll();
    
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async clearFallLogs() {
        await this.openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['fallLogs'], 'readwrite');
            const store = transaction.objectStore('fallLogs');
            const request = store.clear();
    
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

export default IndexedDBService;