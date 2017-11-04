console.log('starting function');

const qs = require('qs');
const VoiceReponse = require('twilio').twiml.VoiceResponse;

exports.handle = function(e, ctx, cb) {
  console.log('processing event: %j', e)
  var twiml = new VoiceReponse();

  var noanswerurl             = process.env.NOANSWERURL || null;
  var thanksformessageurl     = process.env.THANKSFORMESSAGEURL || null;
  var recordingstatuscallback = process.env.RECORDINGSTATUSURL || '/recordstatus';
  var messagemaxlength        = process.env.MESSAGEMAXLENGTH ? parseInt(process.env.MESSAGEMAXLENGTH) : 30;

  var body = {};
  if(e && e.reqbody){
    body = qs.parse(e.reqbody);
  }

  switch(body.DialCallStatus){
    case 'no-answer':
      if(noanswerurl){
        twiml.play(noanswerurl);
      }else {
        twiml.say("Sorry we couldn't get to the phone, please leave a message after the beep.");
      }
      twiml.record({ maxLength: messagemaxlength, recordingStatusCallback: recordingstatuscallback});
      break;
    default:
      if(thanksformessageurl){
        twiml.play(thanksformessageurl);
      } else {
        twiml.say("Thanks for your message! We will get back to you soon. Goodbye.");
      }
      twiml.hangup();
      break;
  }

  var responseBody = twiml.toString();
  var response = {
      statusCode: 200,
      body: responseBody
  };

  cb(null, response);
}
