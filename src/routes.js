module.exports = function(app) {
    const userController = require('./controllers/userController');
    const projectController = require('./controllers/projectController');
    const pageController = require('./controllers/pageController');

    app.get('/', (req, res) =>
        res.send('Hello World')
    );

    app.post('/user', userController.createUser);
    app.get('/users', userController.getAll);

    app.post('/project', projectController.createProject);
    app.get('/projects', projectController.getProjects);

    app.get('/pages', pageController.getAll);
    app.post('/actions', pageController.saveAction);
};
