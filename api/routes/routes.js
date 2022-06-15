module.exports = async (app, router, config, logger, mongoose, path, fs) => {
    let routes = config.settings.routes;
    const HolidayModel = require('../model/holiday');
    const LeaveApplicationModel = require('../model/leaveApplication');
    const services = require('../utilities/services')(mongoose, config, logger,path, fs, HolidayModel, LeaveApplicationModel)
    router.get('/', function (req, res, next) {
        res.send('respond with a resource');
        console.log('Server setup DONE');
    });

    router.get(routes.holiday, services.getAllHoliday);
    router.post(routes.holiday, services.createHoliday);
    router.get(routes.leave, services.getAllLeave);
    router.put(routes.leave, services.updateOrCreateLeave);
}