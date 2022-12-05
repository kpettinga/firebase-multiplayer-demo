export const addPlayerNode = (data) => {
  const { x, y, id, classNames } = data;
  const playerNode = document.createElement("div");
  playerNode.id = id;
  if (classNames instanceof Object)
    playerNode.classList.add("player", ...classNames);
  move(playerNode, x, y);
  return playerNode;
};

export const addMovementControls = (playerNode, onMove) => {
  document.addEventListener("click", (event) => {
    const { clientX, clientY } = event;
    move(playerNode, clientX, clientY);
    if (typeof onMove === "function") {
      onMove(clientX, clientY);
    }
  });

  document.addEventListener("touchstart", (event) => {
    const { clientX, clientY } = event.touches[0];
    move(playerNode, clientX, clientY);
    if (typeof onMove === "function") {
      onMove(clientX, clientY);
    }
  });
};

export const move = (playerNode, x, y) => {
  playerNode.style.transform = `translate3d(${x}px,${y}px,0)`;
};
