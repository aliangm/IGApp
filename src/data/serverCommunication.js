import q from 'q';
//SAFARI BUG FIX - no default fetch, need to use external library
import 'whatwg-fetch';
//SAFARI BUG FIX - no default promise, need to use external library
import Promise from 'promise-polyfill';
import AuthService from 'components/utils/AuthService';

if (!window.Promise) {
  window.Promise = Promise;
}

export default {

	serverRequest(httpFunc, route, body, region, planDate) {
		
		const deferred = q.defer();
		const lock = new AuthService();
		let URL = window.location.protocol + '//' + window.location.hostname + ':8443/' + route;
    if (lock.getProfile().isAdmin === false){
    	URL += '/' + lock.getProfile().app_metadata.UID+ '/';
		}
		if (region || planDate) {
      URL += '?';
    }
    if (region) {
    	URL += 'region=' + region + '&';
		}
		if (planDate) {
			URL += 'planDate=' + planDate;
		}
		//fetch('http://localhost:3000/' + route, {
		//fetch('http://infinigrowtest.centralus.cloudapp.azure.com:3000/' + route, {
		fetch(encodeURI(URL), {
		method: httpFunc,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + lock.getToken()
			},
			body: body,
			credentials: 'include'
		})
			.then((response) => {
				deferred.resolve(response);
				//response.json()
					//.then(function (json) {
						//console.log('json: ' + JSON.stringify(json));
						//deferred.resolve(json);
				//	})
				//	.catch(function(err) {
				//		deferred.reject(err);
				//	})
			})
			.catch((error) => {
				deferred.reject(error);
			});
		
		return deferred.promise;
	}
}