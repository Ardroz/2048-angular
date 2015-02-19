/*jslint node: true, indent: 2, nomen:true */
'use strict';

function generateUniqueId() {
  var generateUid = function () {
    // http://www.ietf.org/rfc/rfc4122.txt
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    var d = new Date().getTime(),
      uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r&0x7|0x8)).toString(16);
      });
    return uuid;
  };
  return {
    next: function() { return generateUid(); }
  };
}

module.exports = function (grid) {
  grid.factory('GenerateUniqueId', generateUniqueId);
};
