const _ = require('lodash');
const navigationService = require('../services/navigationService');
const pageService = require('../services/pageService');


function getNavigation(sessionTemp, resolve, reject) {
    navigationService.getBySession(sessionTemp, (err, page) => {
        if (err) reject(err);

        resolve(page);
    });
}

function getNavigationByProject(project, sessionTemp, resolve, reject) {

    navigationService.getByProject(project, sessionTemp, (err, page) => {
        if (err) reject(err);

        resolve(page);
    });
}

function createNavigation(data, user, project) {
    const pageData = mergePageInfo(data);

    new Promise(createPage.bind(this, pageData)).then((page) => {
        navigationService.create({
            sessionTemp: data.data.sessionTemp,
            pages: page,
            project: project._id,
            user
        }, (err, navigation) => {});
    });
}

function createPage(data, resolve, reject) {
    pageService.create(data, (err, page) => {
        if (err) {
            reject(err);
        } else {
            resolve(page);
        }
    });
}

function mergePageInfo(data) {
    const pageInfo = data.data.page[0];
    const metaDatas = data.data.metaData;
    const actions = data.data.actions;
    const pageInfoCloned = Object.assign({}, pageInfo);

    pageInfoCloned.loadedOn = new Date().getTime();
    pageInfoCloned.pageToken = data.data.pageToken;

    if (!pageInfoCloned.metaData) {
        pageInfoCloned.metaData = [];
    }

    if (!pageInfoCloned.actions) {
        pageInfoCloned.actions = [];
    }

    for (const metadata in metaDatas) {
        pageInfoCloned.metaData.push(metaDatas[metadata]);
    }

    for (const action in actions) {
        pageInfoCloned.actions.push(actions[action]);
    }

    return pageInfoCloned;
}

function formatBooking(booking) {
    const bookingFormatted = {};
    _.forEach(booking, (bookingAttr) => {
       bookingFormatted[bookingAttr.key] = bookingAttr.value;
    });

    return bookingFormatted;
}

function updatePage(navigation, data) {
    const pageData = mergePageInfo(data);

    return new Promise(createPage.bind(this, pageData))
        .then(insertPage)
        .then(insertOrUpdateBooking)
        .then(saveNavigation);

    function insertPage(page) {
        return navigation.pages.push(page);
    }

    function insertOrUpdateBooking() {
        if (data.data.booking.length > 0) {
            const booking = formatBooking(data.data.booking);
            const index = navigation.bookings.findIndex(each => each.bookingCode === booking.bookingCode)
            if (index !== -1) {
                navigation.bookings[index] = booking;
            } else {
                navigation.bookings.push(booking);
            }
        }
    }

    function saveNavigation() {
        navigation.save();
    }

}

module.exports = {
    getNavigation,
    createNavigation,
    createPage,
    updatePage,
    getNavigationByProject
};
