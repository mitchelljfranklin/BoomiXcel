/**
 * Shared toast notification utility.
 *
 * USAGE:
 *   showToast("Settings saved.", 3000);           // default (green) toast, 3s
 *   showToast("Error occurred.", 5000, "error");  // red error toast, 5s
 *
 * Available in content scripts (via bundle) and the options page (via <script> tag).
 * Do not write inline toast HTML or use alert().
 */

function showToast(message, duration, type) {
  duration = duration || 3000;
  var container = document.getElementById("bph-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "bph-toast-container";
    container.style.cssText = "position:fixed;top:1rem;right:1rem;z-index:99999;";
    document.body.appendChild(container);
  }

  var toast = document.createElement("div");
  toast.className = "bph-toast";
  if (type === "error") toast.classList.add("bph-toast-error");
  toast.innerHTML = message;
  container.appendChild(toast);

  requestAnimationFrame(function () { toast.classList.add("show"); });

  setTimeout(function () {
    toast.classList.remove("show");
    setTimeout(function () { toast.remove(); }, 300);
  }, duration);
}
