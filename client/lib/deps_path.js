DepsPath = function (host) {
    var path = '/',
        deps = new Deps.Dependency;

    var get = function () {
        if (typeof Deps === 'undefined') {
            return;
        }
        Deps.depend(deps);
        return path;
    };

    var set = function (value) {
        path = value;
        deps.changed();
    };

    innerChain = {set: set};
    innerChain.__proto__ = get.__proto__;
    get.__proto__ = innerChain;
    return get;
};
