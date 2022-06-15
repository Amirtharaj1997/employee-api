
module.exports = (mongoose, config, logger,path, fs, HolidayModel, LeaveApplicationModel) => {
    function findNumberOfLeave(body, callback) {
        let initialTime = new Date(body.fromDate)
            ,endTime     = new Date(body.toDate)
            ,arrTime     = []
            ,count = 0
            ,totalDay = 0;
        for (let q = initialTime; q <= endTime; q.setDate(q.getDate() + 1)) {
            if(q.getDay() !== 6 || q.getDay() !== 0) {
                arrTime.push(new Date(q));
            } else {
                count += 1;
            }
            totalDay += 1;
        }
       HolidayModel.count({
           holidayDate : { $and : [{$in: arrTime}, {employeeId: body.employeeId} ]}
       }, function (e, holidayCount) {
           if(e) {
               logger.error(500, e.stack);
               callback(e)
           }
           callback(null, totalDay - holidayCount + count);
       })
    }
    return {
        getAllHoliday: async function(req, res) {
            try {
             const body = await HolidayModel.find();
             res.send(body).status(200);
            } catch (e) {
                logger.error(500, e.stack);
                return res.status(500);
            }
        },
        createHoliday: function (req, res) {
            const body = req.body;
            HolidayModel.find({
                holidayDate: body.holidayDate
            }, function(err, holidays) {
                if(err) {
                    logger.error(401, err.stack);
                    return res.status(500);
                }
                if(holidays && holidays.length) {
                    logger.error(401, "Bad request");
                    return res.status(401);
                }  else {
                    const holidayModel = new HolidayModel({
                        ...body
                    });
                    holidayModel.save((err, data) => {
                        if(err) {
                            logger.error(500, err.stack);
                            return res.status(500);
                        }
                        return res.send(data).status(201);
                    })
                }
            });

        },
        getAllLeave: async function(req, res) {
            try {
                const body =  await LeaveApplicationModel.find();
                return res.send(body).status(200);
            } catch (e) {
                logger.error(500, e.stack);
                return res.status(500);
            }

        },
        updateOrCreateLeave: function(req, res) {
            const body = req.body;
            let condition = {
                $or : [
                    {
                        fromDate: {$gte: new Date(body.fromDate)},
                        toDate: {$lte: new Date(body.fromDate)},
                        employeeId: body.employeeId
                    },
                    {
                        fromDate: {$gte: new Date(body.toDate)},
                        toDate: {$lte: new Date(body.toDate)},
                        employeeId: body.employeeId
                    }
                ]
            };
            if(body.id) {
               condition = {...condition, $and: {_id: {$ne: mongoose.Types.ObjectId(body.id)}}};
            }
            LeaveApplicationModel.find(condition, function (err, data) {
                if(err) {
                    logger.error(500, err.stack);
                    return res.status(500);
                }
                if(data && data.length) {
                    return res.status(401);
                }
                findNumberOfLeave(body, function (e, count) {
                   if(count === 0) {
                       return res.status(401).send("not valid entry");
                   }
                    new LeaveApplicationModel({
                        ...body,
                            ...{noOfLeave: count}
                    }).save((error, response) => {
                        if(error) {
                            logger.error(500, error.stack);
                            return res.status(500);
                        }
                        return res.send(response).status(201);
                    })
                });
            })
        }
    }
}