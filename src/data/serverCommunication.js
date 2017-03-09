import q from 'q';
//SAFARI BUG FIX - no default fetch, need to use external library
import 'whatwg-fetch';
//SAFARI BUG FIX - no default promise, need to use external library
import Promise from 'promise-polyfill';

if (!window.Promise) {
  window.Promise = Promise;
}

export default {

	serverRequest(httpFunc, route, body, handleResponse) {
		
		var deferred = q.defer();

		//fetch('http://localhost:3000/' + route, {
		//fetch('http://infinigrowtest.centralus.cloudapp.azure.com:3000/' + route, {
		fetch(window.location.protocol + '//' + window.location.hostname + ':8443/' + route, {
		method: httpFunc,
			headers: {
				'Content-Type': 'application/json'
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