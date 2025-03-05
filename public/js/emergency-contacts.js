// js/emergency-contacts.js
import IndexedDBService from '../services/indexedDB-service.js';

class EmergencyContactManager {
    constructor() {
        this.indexedDBService = new IndexedDBService();
        this.contactForm = document.getElementById('emergencyContactForm');
        this.contactsList = document.getElementById('contactsList');

        this.initEventListeners();
        this.loadContacts();
    }

    initEventListeners() {
        this.contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
    }

    async handleContactSubmit(event) {
        event.preventDefault();

        const contactName = document.getElementById('contactName').value;
        const contactPhone = document.getElementById('contactPhone').value;
        const contactRelation = document.getElementById('contactRelation').value;

        const contact = {
            name: contactName,
            phone: contactPhone,
            relation: contactRelation
        };

        try {
            await this.indexedDBService.addEmergencyContact(contact);
            this.loadContacts();
            this.contactForm.reset();
        } catch (error) {
            console.error('Error adding contact:', error);
            alert('Failed to add emergency contact');
        }
    }

    async loadContacts() {
        try {
            const contacts = await this.indexedDBService.getAllEmergencyContacts();
            this.renderContacts(contacts);
        } catch (error) {
            console.error('Error loading contacts:', error);
        }
    }

    renderContacts(contacts) {
        // Clear existing list
        this.contactsList.innerHTML = '';

        // Render contacts
        contacts.forEach(contact => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${contact.name}</strong>
                <span>Phone: ${contact.phone}</span>
                <span>Relation: ${contact.relation}</span>
            `;
            this.contactsList.appendChild(li);
        });
    }
}

// Initialize the manager when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new EmergencyContactManager();
});