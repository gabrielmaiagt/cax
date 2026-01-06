/**
 * Funnel Analytics Tracking Library
 * Tracks user behavior across the entire funnel
 * Storage: Firebase Firestore (with localStorage fallback)
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'funnel_analytics';
    const USE_FIREBASE = typeof firebase !== 'undefined' && typeof window.firebaseDB !== 'undefined';

    // Generate unique session ID
    function generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Get or create session ID
    function getSessionId() {
        let sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = generateSessionId();
            sessionStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    }

    // ==================== FIREBASE FUNCTIONS ====================

    // Save event to Firebase
    async function saveEventToFirebase(event) {
        try {
            const db = window.firebaseDB;
            await db.collection('analytics').doc('events').collection('items').add(event);
            console.log('📊 Event saved to Firebase:', event.type);
        } catch (error) {
            console.error('Error saving to Firebase:', error);
            // Fallback to localStorage
            saveEventToLocalStorage(event);
        }
    }

    // Get all events from Firebase
    async function getEventsFromFirebase() {
        try {
            const db = window.firebaseDB;
            const snapshot = await db.collection('analytics').doc('events').collection('items')
                .orderBy('timestamp', 'desc')
                .get();

            const events = [];
            snapshot.forEach(doc => {
                events.push({ id: doc.id, ...doc.data() });
            });

            return {
                events: events,
                sessions: [...new Set(events.map(e => e.sessionId))],
                pageViews: events.filter(e => e.type === 'pageView'),
                formData: events.filter(e => e.type === 'formField'),
                clicks: events.filter(e => e.type === 'click'),
                navigation: events.filter(e => e.type === 'navigation')
            };
        } catch (error) {
            console.error('Error reading from Firebase:', error);
            return getStoredDataFromLocalStorage();
        }
    }

    // Clear all events from Firebase
    async function clearFirebaseData() {
        try {
            const db = window.firebaseDB;
            const snapshot = await db.collection('analytics').doc('events').collection('items').get();

            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

            await batch.commit();
            console.log('📊 Firebase analytics data cleared');
        } catch (error) {
            console.error('Error clearing Firebase data:', error);
        }
    }

    // ==================== LOCALSTORAGE FUNCTIONS (FALLBACK) ====================

    function getStoredDataFromLocalStorage() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : {
                sessions: [],
                events: [],
                pageViews: [],
                formData: [],
                clicks: [],
                navigation: []
            };
        } catch (e) {
            console.error('Error reading analytics data:', e);
            return {
                sessions: [],
                events: [],
                pageViews: [],
                formData: [],
                clicks: [],
                navigation: []
            };
        }
    }

    function saveEventToLocalStorage(event) {
        try {
            const data = getStoredDataFromLocalStorage();
            data.events.push(event);

            // Organize by type
            switch (event.type) {
                case 'pageView':
                    data.pageViews.push(event);
                    break;
                case 'formField':
                    data.formData.push(event);
                    break;
                case 'click':
                    data.clicks.push(event);
                    break;
                case 'navigation':
                    data.navigation.push(event);
                    break;
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving analytics data:', e);
        }
    }

    function clearLocalStorageData() {
        localStorage.removeItem(STORAGE_KEY);
        console.log('📊 localStorage analytics data cleared');
    }

    // ==================== PUBLIC API ====================

    // Track page view
    window.trackPageView = function (pageName, metadata = {}) {
        const sessionId = getSessionId();

        const pageView = {
            sessionId: sessionId,
            type: 'pageView',
            page: pageName,
            timestamp: new Date().toISOString(),
            metadata: {
                ...metadata,
                referrer: document.referrer,
                userAgent: navigator.userAgent,
                screenSize: `${window.innerWidth}x${window.innerHeight}`
            }
        };

        if (USE_FIREBASE) {
            saveEventToFirebase(pageView);
        } else {
            saveEventToLocalStorage(pageView);
        }

        console.log('📊 Page View:', pageName);
    };

    // Track custom event
    window.trackEvent = function (eventName, eventData = {}) {
        const sessionId = getSessionId();

        const event = {
            sessionId: sessionId,
            type: 'customEvent',
            name: eventName,
            timestamp: new Date().toISOString(),
            data: eventData
        };

        if (USE_FIREBASE) {
            saveEventToFirebase(event);
        } else {
            saveEventToLocalStorage(event);
        }

        console.log('📊 Event:', eventName, eventData);
    };

    // Track form field interaction
    window.trackFormField = function (fieldName, value, pageName) {
        const sessionId = getSessionId();

        // Mask sensitive data (CPF, phone)
        let maskedValue = value;
        if (fieldName.toLowerCase().includes('cpf')) {
            maskedValue = value.replace(/\d(?=\d{4})/g, '*');
        } else if (fieldName.toLowerCase().includes('celular') || fieldName.toLowerCase().includes('phone')) {
            maskedValue = value.replace(/\d(?=\d{4})/g, '*');
        }

        const formEntry = {
            sessionId: sessionId,
            type: 'formField',
            field: fieldName,
            value: maskedValue,
            page: pageName,
            timestamp: new Date().toISOString()
        };

        if (USE_FIREBASE) {
            saveEventToFirebase(formEntry);
        } else {
            saveEventToLocalStorage(formEntry);
        }

        console.log('📊 Form Field:', fieldName, maskedValue);
    };

    // Track click
    window.trackClick = function (element, label, pageName) {
        const sessionId = getSessionId();

        const click = {
            sessionId: sessionId,
            type: 'click',
            element: element,
            label: label,
            page: pageName,
            timestamp: new Date().toISOString()
        };

        if (USE_FIREBASE) {
            saveEventToFirebase(click);
        } else {
            saveEventToLocalStorage(click);
        }

        console.log('📊 Click:', label);
    };

    // Track navigation
    window.trackNavigation = function (from, to) {
        const sessionId = getSessionId();

        const nav = {
            sessionId: sessionId,
            type: 'navigation',
            from: from,
            to: to,
            timestamp: new Date().toISOString()
        };

        if (USE_FIREBASE) {
            saveEventToFirebase(nav);
        } else {
            saveEventToLocalStorage(nav);
        }

        console.log('📊 Navigation:', from, '→', to);
    };

    // Get all analytics data
    window.getAnalyticsData = async function () {
        if (USE_FIREBASE) {
            return await getEventsFromFirebase();
        } else {
            return getStoredDataFromLocalStorage();
        }
    };

    // Clear analytics data
    window.clearAnalyticsData = async function () {
        if (USE_FIREBASE) {
            await clearFirebaseData();
        } else {
            clearLocalStorageData();
        }
    };

    // Export analytics data as JSON
    window.exportAnalyticsJSON = async function () {
        const data = await getAnalyticsData();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Export analytics data as CSV
    window.exportAnalyticsCSV = async function () {
        const data = await getAnalyticsData();

        // Convert events to CSV
        let csv = 'Session ID,Type,Timestamp,Page,Details\n';

        data.events.forEach(event => {
            const details = event.name || event.field || event.label || event.from || JSON.stringify(event.metadata || {});
            csv += `"${event.sessionId}","${event.type}","${event.timestamp}","${event.page || ''}","${details}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_${new Date().toISOString()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    console.log('📊 Analytics library loaded', USE_FIREBASE ? '(Using Firebase 🔥)' : '(Using localStorage)');
})();
