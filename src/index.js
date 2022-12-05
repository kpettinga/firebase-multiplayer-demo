import { initializeApp } from "@firebase/app";
import {
  getDatabase,
  onDisconnect,
  onValue,
  push,
  ref,
  remove,
  set
} from "@firebase/database";
import { addMovementControls, addPlayerNode, move } from "./util";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  databaseURL: "https://YOUR-FIREBASE-URL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// get app container
const appContainer = document.getElementById("app");

// prevent click event on touch devices
if (window.ontouchstart) {
  appContainer.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
  });
}

const playersRef = ref(database, "players");

const startingPosition = { x: 100, y: 100 };

const playerRef = push(playersRef, startingPosition);

const playerNode = addPlayerNode({
  ...startingPosition,
  id: playerRef.key,
  classNames: ["own"]
});

appContainer.appendChild(playerNode);

addMovementControls(playerNode, (x, y) => {
  set(playerRef, { x, y });
});

onDisconnect(playerRef).update({
  disconnecting: true
});

onValue(playersRef, (snapshot) => {
  snapshot.forEach((player) => {
    if (player.key === playerRef.key) {
      return;
    }
    const { x, y, disconnecting } = player.val();
    let otherPlayerNode = document.getElementById(player.key);
    if (otherPlayerNode) {
      if (disconnecting) {
        appContainer.removeChild(document.getElementById(player.key));
        remove(player.ref);
        return;
      }
      move(otherPlayerNode, x, y);
    } else {
      otherPlayerNode = addPlayerNode({
        x: 100,
        y: 100,
        id: player.key
      });
      appContainer.appendChild(otherPlayerNode);
    }
  });
});
