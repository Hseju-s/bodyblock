// v.1.0 Tuturu
const Command = require('command');

module.exports = function RemoveBodyBlock(dispatch) {
const command = Command(dispatch);

let enabled = false,
	inParty = false,
	info,
	Members = [];

	command.add('bb', arg => {
		if(arg.toLowerCase() === 'off'){
	        enabled = true;
	        if(inParty) bodyblock(1);
	        command.message(' No more Body-block!');
        }
        else if(arg.toLowerCase() === 'on'){
            enabled = false;
            bodyblock(0);
            command.message(' Body-blocking is back on!')
        }
        else command.message(' bb on || bb off')
	});

	const bodyblock = arg => {
		if(info) info.unk4 = (arg === 0) ? 0 : 1;
		for(const x in Members){
			info.leader = Members[x];
			dispatch.toClient('S_PARTY_INFO', 1, info);
		}
	}

	dispatch.hook('S_PARTY_MEMBER_LIST', 5, event => {
        Members = [];
        inParty = true;
        for(const x in event.members) Members.push(event.members[x].cid);
        if(enabled) setTimeout(() => {bodyblock(1)}, 1000);
    });

    dispatch.hook('S_LEAVE_PARTY', 1, event => {
    	inParty = false;
    	setTimeout(() => {bodyblock(0)}, 500);
    });

    dispatch.hook('S_SPAWN_USER', 13, event => {
    	if(enabled && inParty && info) setTimeout(() => {bodyblock(1);}, 2000);
    });

    dispatch.hook('S_PARTY_INFO', 1 , event => {info = Object.assign({}, event);});
}