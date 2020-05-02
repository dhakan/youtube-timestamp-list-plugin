const $list = document.querySelector(".list");

const handleActiveTab = (tabs) => {
  const activeTab = tabs[0];

  const onListItemClicked = (item) => {
    const target = item[1];

    browser.tabs.sendMessage(activeTab.id, {
      command: "seek-to",
      target: target,
    });
  };

  const createListItem = (timestamp) => {
    const $li = document.createElement("li");
    $li.classList.add("item");
    $li.innerText = timestamp[0];
    $list.append($li);

    $li.addEventListener("click", () => onListItemClicked(timestamp));
  };

  const onMessage = (message) => {
    if (message.command === "timestamps") {
      const { timestamps } = message;

      timestamps.forEach((item) => createListItem(item));
    }
  };

  browser.runtime.onMessage.addListener(onMessage);
  browser.tabs.sendMessage(activeTab.id, {
    command: "get-timestamps",
  });
};

browser.tabs.query({ active: true, currentWindow: true }).then(handleActiveTab);
// .catch(reportError);
