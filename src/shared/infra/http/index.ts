import { v1Router } from './api/v1';
import {app} from './app'

app.use('/api/v1', v1Router);

// about page
app.get('/catalog', function (req, res) {
    res.render('pages/catalog/catalog');
});