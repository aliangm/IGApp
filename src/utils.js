import {getProfileSync} from 'components/utils/AuthService';
import chunk from 'lodash/chunk';
import concat from 'lodash/concat';

export function userPermittedToPage(page) {
  const userProfile = getProfileSync();
  if(userProfile.isAdmin) {
    return true;
  }
  else{
    const blockedPages = userProfile.app_metadata.blockedPages;
    return !blockedPages || blockedPages.findIndex(blockedPage => page === blockedPage) === -1;
  }
}

export function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function addQuarters (array, quarterDataFunc, firstQuarterOffset) {

  const quartersSplit = [array.slice(0, firstQuarterOffset),
    ...chunk(array.slice(firstQuarterOffset), 3)];

  const withQuarterAddition = quartersSplit.map((quarterMonths, index) => {
    // If last quarter did not end, don't add quarter value
    if (index == quartersSplit.length - 1 && firstQuarterOffset !== 0) {
      return quarterMonths;
    }
    else {
      return [...quarterMonths, quarterDataFunc(quarterMonths)];
    }
  });

  return concat(...withQuarterAddition);
}
