function initializeExamples(app){
  
  // Are examples enabled?
  if(!app.get('makers_examples_enabled'))
    return false;

  const twig = require('twig');

  // Utilize twig engine
  app.set('view engine', 'twig');
  twig.cache(false);

  app.get('/makers_examples*', (req, res) => {
    const requestedView =  req.originalUrl.split('/makers_examples/')[1];

    res.render(`makers_examples/${requestedView}`, { 
      firebase_public_config: JSON.stringify(app.get('firebase_public'))
    });
  });

  console.log('lets go, examples enabledsss');
}

module.exports = initializeExamples;