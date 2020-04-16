const regex = /(.*)(\d{1,2}:\d{2}(?!:\d{2})?)(.*)/g;
const $description = document.querySelector("#description");
const links = Array.from($description.innerHTML.matchAll(regex));

const $player = document.querySelector("#player-container-outer.style-scope.ytd-watch-flexy");
$player.style.position = "relative";

const createList = () => {
  const $ul = document.createElement("ul");
  $ul.style.overflow = "scroll";
  $ul.style.listStyleType = "none";
  $ul.style.position = "absolute";
  $ul.style.top = "0";
  $ul.style.right = "0";
  $ul.style.bottom = "0";
  $ul.style.fontSize = "1.6rem";
  $ul.style.color = "white";
  $ul.style.zIndex = "1";

  links.forEach((item) => {
    console.log(item, window.location.href)
    const $li = document.createElement("li");
    // const $a = document.createElement("a")

    $li.style.backgroundColor = "purple";
    $li.style.padding = "1rem";
    // $a.setAttribute("href", item[2])
    // $a.innerHTML = item[0]
    $li.innerHTML = item[0]
    // $li.append($a)
    $ul.append($li);
  });

  $player.append($ul);
};

console.log("tjo", links, $player);
createList();
