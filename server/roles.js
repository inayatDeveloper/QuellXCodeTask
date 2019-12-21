const AccessControl = require("accesscontrol"),
    ac = new AccessControl();

exports.roles = (function () {
    ac.grant("basic")
        .readOwn("user")
        .updateOwn("user")

    ac.grant("supervisor")
        .extend("basic")
        .readAny("user")

    ac.grant("admin")
        .extend("basic")
        .extend("supervisor")
        .updateAny("user")
        .deleteAny("user")

    return ac;
})();
