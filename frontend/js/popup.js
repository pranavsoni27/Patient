function showPopup(message, type = 'success', duration = 0) {
    // Remove any existing popups
    const existingOverlay = document.querySelector('.popup-overlay');
    const existingPopup = document.querySelector('.custom-popup');
    if (existingOverlay) existingOverlay.remove();
    if (existingPopup) existingPopup.remove();
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    
    // Create popup
    const popup = document.createElement('div');
    popup.className = 'custom-popup';
    
    // Create icon
    const icon = document.createElement('i');
    if (type === 'success') {
        icon.className = 'fas fa-check-circle success-icon';
    } else {
        icon.className = 'fas fa-exclamation-circle error-icon';
    }
    
    // Create message
    const messageDiv = document.createElement('div');
    messageDiv.className = `popup-message ${type}`;
    messageDiv.textContent = message;
    
    // Assemble popup
    popup.appendChild(icon);
    popup.appendChild(messageDiv);
    
    // Add to document
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    
    // Return elements for manual closing
    return { overlay, popup };
}

function closePopup(overlay, popup) {
    if (!overlay || !popup) return;
    
    // Add fade-out animation
    popup.style.opacity = '0';
    overlay.style.opacity = '0';
    
    // Remove elements after fade out
    setTimeout(() => {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
        if (popup && popup.parentNode) {
            popup.parentNode.removeChild(popup);
        }
    }, 300);
}
