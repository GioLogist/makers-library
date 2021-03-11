const firebase = require('firebase-admin');
const { OAuthStrategy } = require('@feathersjs/authentication-oauth');
const { NotAuthenticated } = require('@feathersjs/errors');

const logger = require('./logger');

function initialize(app){
  const firebaseConfig = app.get('firebase');

  // Initialize app
  try {
    firebase.initializeApp({
      credential: firebase.credential.cert(firebaseConfig)
    });
  } catch (e) {
    console.log('erorr initializing firebase', e);
  }
}

class FirebaseStrategy extends OAuthStrategy {
  
  async authenticate(authentication, params){
    logger.debug('firebase:strategy:authenticate');
    return super.authenticate(authentication, params);
  }

  async getProfile(data, _params){
    const firebase = require('firebase-admin');
    let user;

    try {
      user = await firebase.auth().verifyIdToken(data.access_token);
    } catch(e){
      logger.error(e);
      throw new NotAuthenticated();
    }
    
    logger.debug(`firebase:strategy:getProfile:successful ${user.user_id}`);

    return {
      email: user.email,
      id: user.user_id
    };
  }
  
  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);

    return {
      ...baseData,
      email: profile.email
    };
  }
}

module.exports = { initialize, FirebaseStrategy };