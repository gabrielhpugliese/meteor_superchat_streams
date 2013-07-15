DepsPath = function (host) {
    this.path = '/';
    this.deps = new Deps.Dependency;

    var get = function () {
        if (typeof Deps === 'undefined')
            return;
        Deps.depend(this.deps);
        return this.path;
    }.bind(this);

    var set = function (value) {
        this.path = value;
        this.deps.changed();
    }.bind(this);

    innerChain = {set: set};
    innerChain.__proto__ = get.__proto__;
    get.__proto__ = innerChain;
    return get;
};