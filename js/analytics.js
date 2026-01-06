/**
 * Funnel Analytics Tracking Library
 * Tracks user behavior across the entire funnel
 */

(function() {
    'use strict';
    
    const STORAGE_KEY = 'funnel_analytics';
    
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
    
    // Get analytics data from localStorage
    function getStoredData() {
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
    
    // Save analytics data to localStorage
    function saveData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving analytics data:', e);
        }
    }
    
    // Track page view
    window.trackPageView = function(pageName, metadata = {}) {
        const data = getStoredData();
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
        
        data.pageViews.push(pageView);
        data.events.push(pageView);
        saveData(data);
        
        console.log('📊 Page View:', pageName);
    };
    
    // Track custom event
    window.trackEvent = function(eventName, eventData = {}) {
        const data = getStoredData();
        const sessionId = getSessionId();
        
        const event = {
            sessionId: sessionId,
            type: 'customEvent',
            name: eventName,
            timestamp: new Date().toISOString(),
            data: eventData
        };
        
        data.events.push(event);
        saveData(data);
        
        console.log('📊 Event:', eventName, eventData);
    };
    
    // Track form field interaction
    window.trackFormField = function(fieldName, value, pageName) {
        const data = getStoredData();
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
        
        data.formData.push(formEntry);
        data.events.push(formEntry);
        saveData(data);
        
        console.log('📊 Form Field:', fieldName, maskedValue);
    };
    
    // Track click
    window.trackClick = function(element, label, pageName) {
        const data = getStoredData();
        const sessionId = getSessionId();
        
        const click = {
            sessionId: sessionId,
            type: 'click',
            element: element,
            label: label,
            page: pageName,
            timestamp: new Date().toISOString()
        };
        
        data.clicks.push(click);
        data.events.push(click);
        saveData(data);
        
        console.log('📊 Click:', label);
    };
    
    // Track navigation
    window.trackNavigation = function(from, to) {
        const data = getStoredData();
        const sessionId = getSessionId();
        
        const nav = {
            sessionId: sessionId,
            type: 'navigation',
            from: from,
            to: to,
            timestamp: new Date().toISOString()
        };
        
        data.navigation.push(nav);
        data.events.push(nav);
        saveData(data);
        
        console.log('📊 Navigation:', from, '→', to);
    };
    
    // Get all analytics data
    window.getAnalyticsData = function() {
        return getStoredData();
    };
    
    // Clear analytics data
    window.clearAnalyticsData = function() {
        localStorage.removeItem(STORAGE_KEY);
        console.log('📊 Analytics data cleared');
    };
    
    // Export analytics data as JSON
    window.exportAnalyticsJSON = function() {
        const data = getStoredData();
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
    window.exportAnalyticsCSV = function() {
        const data = getStoredData();
        
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
    
    console.log('📊 Analytics library loaded');
})();
