// Masquer les erreurs d'extension de navigateur
window.addEventListener('error', function(e) {
  if (e.message && e.message.includes('Could not establish connection')) {
    e.preventDefault();
    return false;
  }
});

window.addEventListener('unhandledrejection', function(e) {
  if (e.reason && e.reason.message && e.reason.message.includes('Could not establish connection')) {
    e.preventDefault();
    return false;
  }
});