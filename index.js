const regex = /.*?(\d{1,2}:\d{1,2}(?::\d{1,2})?).*/g;
const $description = document.querySelector("#description");
const player = window.wrappedJSObject.movie_player;
const links = Array.from($description.innerText.matchAll(regex));

const $playerContainer = document.querySelector(
  "#player-container-outer"
);
const $playerTheaterContainer = document.querySelector(
  "#player-theater-container"
);

const createList = () => {
  const $ul = document.createElement("ul");
  $ul.classList.add('ytsl-list')

  links.forEach((item) => {
    const $li = document.createElement("li");
    $li.classList.add('ytsl-item')
    $li.innerText = item[0];
    $li.addEventListener("click", function (e) {
      const splitResult = item[1].split(":");
      let date;
      let hours;
      let minutes;
      let seconds;

      if (splitResult.length === 3) {
        [hours, minutes, seconds] = splitResult;
        date = new Date(0, 0, 0, hours || 0, minutes || 0, seconds || 0);
      } else if (splitResult.length === 2) {
        [minutes, seconds] = splitResult;
        date = new Date(0, 0, 0, 0, minutes || 0, seconds || 0);
      }
      const target =
        date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds();

      player.seekTo(target);
    });
    
    $ul.append($li);
  });

  $playerContainer.append($ul);
  $playerTheaterContainer.append($ul)
};

createList();
