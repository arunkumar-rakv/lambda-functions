exports.handler = async (event, context, callback) => {
    // TODO implement
    var ssmInputsJSON = event.ssmInputsJSON;
    console.log('ssmInputsJSON', ssmInputsJSON);
    return ssmInputsJSON;
};
