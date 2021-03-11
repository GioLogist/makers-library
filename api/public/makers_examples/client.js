let client, ui;

init();

function init(){
  initializeFeathers();
  initializeAuth();
  initializeFirebase();
}

function initializeFeathers(){
  // Establish a Socket.io connection
  const socket = io();
  // Initialize our Feathers client application through Socket.io
  // with hooks and authentication.
  client = feathers();

  client.configure(feathers.socketio(socket));
  // Use localStorage to store our login token
  client.configure(feathers.authentication());

  console.log('feathers initialized', client.get('host'))
}

// Either re-authenticate existing session, or start Firebase UI
async function initializeAuth(){
  try {
    await client.reAuthenticate();
    showMemberApp();
  } catch(e){
    // Error re-authenticating, so let's start Firebase UI 
    showGuestApp();
  }
  
  // No longer need to prepare anything
  document.getElementById('app-preparing').style.display = 'none';
}

function initializeFirebase(){
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Initialize the FirebaseUI Widget using Firebase.
  ui = new firebaseui.auth.AuthUI(firebase.auth());
}


async function showMemberApp(){
  // Get user information
  const { user } = await client.get('authentication');

  // Hide Guest App
  document.getElementById('app-guest').style.display = 'none';

  // Show member app
  document.getElementById('app-member').style.display = 'block';
  document.getElementById('app-member').innerHTML = `Logged in as, ${user.email}. <a href="#" id="logout">Logout</a>`;

}

function showGuestApp(){
  // Hide & clear member app
  document.getElementById('app-member').style.display = 'none';
  document.getElementById('app-member').innerHTML = '';

  // Show Guest app
  document.getElementById('app-guest').style.display = 'block';
  startFirebaseUI();
}

function startFirebaseUI(){
  ui.start('#firebaseui-auth-container', {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(async function(idToken) {
          await client.authenticate({
            strategy: 'firebase',
            access_token: idToken,
          });
          showMemberApp();
        });

        return false;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    credentialHelper: firebaseui.auth.CredentialHelper.NONE, // disable accountchooter.com helper
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    ],
    // Other config options...
  });
}

const addEventListener = (selector, event, handler) => {
  document.addEventListener(event, async ev => {
    if (ev.target.closest(selector)) {
      handler(ev);
    }
  });
};

// "Logout" button click handler
addEventListener('#logout', 'click', async () => {
  await client.logout();
    
  showGuestApp();
});
