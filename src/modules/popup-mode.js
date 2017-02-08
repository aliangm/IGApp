import serverCommunication from 'data/serverCommunication';
import q from 'q';
let popup;

export function isPopupMode() {
  return popup;
}

export function disablePopupMode() {
  var deferred = q.defer();
  serverCommunication.serverRequest('PUT', 'useraccount', JSON.stringify({onboarding: false}))
    .then((response) => {
      response.json()
        .then(function (data) {
          if (data){
            popup = false;
            deferred.resolve(popup);
          }
        })
    })
    .catch(function (err) {
      deferred.reject(err);
    });
  return deferred.promise;
}

export function checkIfPopup () {
  var deferred = q.defer();
  serverCommunication.serverRequest('GET', 'useraccount')
    .then((response) => {
      response.json()
        .then(function (data) {
          if (data){
            popup = data.onboarding;
            deferred.resolve(popup);
          }
        })
    })
    .catch(function (err) {
      deferred.reject(err);
    });
  return deferred.promise;
}