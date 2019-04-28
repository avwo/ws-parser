var Receiver = require('./receiver');
var Sender = require('./sender');
var PerMessageDeflate = require('./per-message-deflate');
var extensions = require('./extensions');

function getExtensions(res, isServer) {
  var exts =  res.wsExts == null ? res.headers['sec-websocket-extensions'] : res.wsExts;
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

exports.getSender = function(socket, toServer) {
  return new Sender(socket, getExtensions(socket, !toServer));
};

exports.getReceiver = function(res, fromServer) {
  return new Receiver(getExtensions(res, fromServer));
};
