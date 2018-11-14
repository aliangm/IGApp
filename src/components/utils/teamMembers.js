import {getProfileSync} from 'components/utils/AuthService';

export function getTeamMembersOptions(teamMembers) {
  const profile = getProfileSync();
  const teamMembersOptions = teamMembers.map((member) => {
    const memberUserId = member.userId;
    const label = `${member.firstName} ${member.lastName}${profile.user_id === member.userId ? ' (me)' : ''}`;
    return {value: memberUserId, label: label};
  });
  teamMembersOptions.push({value: 'other', label: 'Other'});
  return teamMembersOptions;
}