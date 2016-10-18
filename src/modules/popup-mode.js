const isPopupForced = window.location.search === '?popup';
let isPopup = isPopupForced || !sessionStorage.getItem("noPopup");

export function isPopupMode() {
  return isPopup;
}

export function disablePopupMode() {
  sessionStorage.setItem('noPopup', '1');
  isPopup = isPopupForced;
}