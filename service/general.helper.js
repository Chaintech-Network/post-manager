const Res =  ( status, message, data) => { // Success Web Response

    let res_obj = {
        "status": status,

        "message": message,

        "data": data
    }

    return {
        status:status,
        data:res_obj
    }
    
};

module.exports = Res