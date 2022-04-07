const batchPlay = require("photoshop").action.batchPlay;

module.exports.placeLinkedImage = async (token) => {
    return await batchPlay(
        [{
            _obj: "placeEvent",
            target: {
                _path: token,
                _kind: "local",
            },
            linked: true,
            freeTransformCenterState: {
                _enum: "quadCenterState",
                _value: "QCSAverage"
            },
        },

        ], {
        synchronousExecution: true,
        modalBehavior: "fail",
    }
    );
}
