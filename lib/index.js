var Receiver = require('./receiver');
var Sender = require('./sender');
var PerMessageDeflate = require('./per-message-deflate');
var extensions = require('./extensions');

function getExtensions(res, isServer) {
  var exts =  res.wsExts || res.headers['sec-websocket-extensions'];
  if (!exts || typeof exts !== 'string') {
    return;
  }
  exts = extensions.parse(exts);
  var extensionName = PerMessageDeflate.extensionName;
  var deflateOptions = exts[extensionName];
  exts = {};
  deflateOptions = deflateOptions !== true ? deflateOptions : {};
  exts[extensionName] = new PerMessageDeflate(deflateOptions, isServer);
  return exts;
}


exports.getExtensions = getExtensions;

exports.getSender = function(socket) {
  return new Sender(socket, getExtensions(socket));
};

exports.getReceiver = function(res, isServer) {
  return new Receiver(getExtensions(res, isServer));
};
