import q from 'q';
/**
import 'whatwg-fetch';
import Promise from 'promise-polyfill';

if (!window.Promise) {
  window.Promise = Promise;
}
 **/
export default {

	serverRequest(httpFunc, route, body, handleResponse) {
		
		var deferred = q.defer();

		//fetch('http://localhost:3000/' + route, {
		fetch('http://infinigrowtest.centralus.cloudapp.azure.com:3000/' + route, {
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