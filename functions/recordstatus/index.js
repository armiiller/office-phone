console.log('starting function');

const qs = require('qs');
const snsPublish = require('aws-sns-publish');

exports.handle = function(e, ctx, cb) {
  console.log('processing event: %j', e)
  var snsarn = process.env.SNSARN;

  var body = {};
  if(e && e.reqbody){
    body = qs.parse(e.reqbody);
  }

  if(snsarn){
    snsPublish(`New Voicemail: ${body.RecordingUrl}`, {arn: snsarn, subject: 'New Voicemail'});
  }

  var response = {
      statusCode: 200,
  };

  cb(null, response);
}
