const uuid = require('node-uuid');
const sessionStore = {};


function parseCookies(req,res,next){
	// res.append('Set-Cookie','hello=goodbye');
	let cookieHeader = req.get('Cookie');
	// console.log(cookieHeader + '========');
	req.hwCookies = {};
	if (cookieHeader){
		cookieHeader = cookieHeader.split(';');
	} else {
		cookieHeader = [];
	}
	cookieHeader.forEach(function(element){
		element = element.trim();
		const parse = element.split('=');
		req.hwCookies[parse[0]] = parse[1];
	});
	// console.log(Object.keys(req.hwCookies)[0]+'=========*************');
	// console.log(req.hwCookies[Object.keys(req.hwCookies)[0]]+'=========*************');
	next();
}

function manageSession(req,res,next){
	let sessionID = req.hwCookies.sessionID;
	if (req.hwCookies.sessionID){
		if (sessionStore[sessionID]){
			req.hwSession = sessionStore[sessionID];
			req.hwSession.sessionID = sessionID;
			// console.log(sessionID + '&&&&&&&&&&&&&&&&&&&&&&&&============');
		} else {
			sessionID = uuid.v4();
			// console.log(sessionID + '&&&&&&&&&&&&&&&&&&&&&&&&');
			sessionStore[sessionID] = {};
			req.hwSession = {sessionID: sessionID};
			res.append("Set-Cookie", "sessionID="+ sessionID + ";HttpOnly");
		}

	} else {
		sessionID = uuid.v4();
		// console.log(sessionID + '&&&&&&&&&&&&&&&&&&&&&&&&');
		sessionStore[sessionID] = {};
		req.hwSession = {sessionID: sessionID};
		res.append("Set-Cookie", "sessionID="+ sessionID + ";HttpOnly");
	}
	next();
}
// manageSession and parseCookies

module.exports = {parseCookies: parseCookies, manageSession: manageSession};
