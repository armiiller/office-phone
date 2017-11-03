console.log('starting function');

const moment = require('moment-timezone');
const _ = require('underscore');
const VoiceReponse = require('twilio').twiml.VoiceResponse;

exports.handle = function(e, ctx, cb) {
  console.log('processing event: %j', e)

  var twiml = new VoiceReponse();

  var companyname             = process.env.COMPANYNAME || "our";
  var timezone                = process.env.TIMEZONE || "America/Los_Angeles";
  var days                    = process.env.DAYS ? _.map(process.env.DAYS.split(','), x => parseInt(x)) : [1,2,3,4,5];
  var days_friendly           = process.env.DAYS_FRIENDLY || "Monday thru Friday";
  var open                    = parseInt(process.env.HOUR_OPEN) || 8;
  var close                   = parseInt(process.env.HOUR_CLOSE) || 17;
  var hour_friendly           = process.env.HOUR_FRIENDLY || '8 AM to 5 PM';
  var number                  = process.env.NUMBER || '';
  var voiceurl                = process.env.VOICEURL || null;
  var recordurl               = process.env.RECORDURL || '/record';
  var dialtimeout             = process.env.DIALTIMEOUT ? parseInt(process.env.DIALTIMEOUT) : 15;
  var recordingstatuscallback = process.env.RECORDINGSTATUSCALLBACK || '/recordstatus';
  var messagemaxlength        = process.env.MESSAGEMAXLENGTH ? parseInt(process.env.MESSAGEMAXLENGTH) : 30;

  var now = moment().tz(timezone);
  var day = now.day();
  var hour = now.hour();

  if(number && _.contains(days, day) && (hour >= open && hour < close)){
    twiml.dial(number, {action: recordurl, timeout: dialtimeout});
  } else {
    if(voiceurl){
      twiml.play(voiceurl)
    } else {
      twiml.say(`Hi! You've reached ${companyname} headquarters. We are currently closed. Our hours of operation are ${days_friendly} ${hour_friendly}. Please leave a message after the beep.`, { voice: 'man' });
    }
    twiml.record({ maxLength: messagemaxlength, recordingStatusCallback: recordingstatuscallback});
  }

  var responseBody = twiml.toString();
  var response = {
      statusCode: 200,
      body: responseBody
  };

  cb(null, response);
}
